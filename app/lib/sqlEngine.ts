/**
 * Client-side In-Memory SQL Execution Engine
 * Thực thi các câu lệnh SQL thực tế (SELECT, WHERE, GROUP BY, ORDER BY, LIMIT, các hàm tổng hợp COUNT, SUM, AVG, MIN, MAX)
 * hỗ trợ nhiều điều kiện AND / OR, đa cột GROUP BY và đa cột ORDER BY.
 */

export interface SqlQueryResult {
  columns: string[];
  rows: Record<string, any>[];
  rowCount: number;
  executionTimeMs: number;
  error?: string;
}

export function executeClientSql(
  query: string,
  tableData: Record<string, any>[]
): SqlQueryResult {
  const startTime = performance.now();

  if (!tableData || tableData.length === 0) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      error: 'Bảng dữ liệu đang trống. Vui lòng chọn hoặc tải lên dữ liệu CSV.',
    };
  }

  const cleanedQuery = query.trim().replace(/;+$/, '');
  if (!cleanedQuery.toUpperCase().startsWith('SELECT')) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: 0,
      error: 'Chỉ hỗ trợ câu lệnh SELECT truy vấn dữ liệu.',
    };
  }

  try {
    let currentRows = [...tableData];

    // 1. Parse WHERE clause
    const whereMatch = cleanedQuery.match(/WHERE\s+([\s\S]+?)(?=\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const whereCondition = whereMatch[1].trim();
      currentRows = currentRows.filter((row) => evaluateCompoundCondition(row, whereCondition));
    }

    // 2. Parse GROUP BY clause
    const groupByMatch = cleanedQuery.match(/GROUP\s+BY\s+([\s\S]+?)(?=\s+ORDER\s+BY|\s+LIMIT|$)/i);
    const selectMatch = cleanedQuery.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
    const selectFields = selectMatch ? selectMatch[1].trim() : '*';

    let resultRows: Record<string, any>[] = [];

    if (groupByMatch) {
      // Split multiple group by columns: e.g. "col1, col2"
      const groupCols = groupByMatch[1]
        .split(',')
        .map((c) => c.trim().replace(/[`"']/g, ''))
        .filter(Boolean);

      if (groupCols.length === 0) {
        throw new Error('Mệnh đề GROUP BY không chứa cột hợp lệ.');
      }

      const groups = new Map<string, { keyValues: Record<string, any>; items: Record<string, any>[] }>();

      currentRows.forEach((row) => {
        const keyObj: Record<string, any> = {};
        const keyParts: string[] = [];

        groupCols.forEach((col) => {
          const val = row[col] ?? row[findCaseInsensitiveKey(row, col)] ?? 'Other';
          keyObj[col] = val;
          keyParts.push(String(val));
        });

        const groupKey = keyParts.join('___');
        if (!groups.has(groupKey)) {
          groups.set(groupKey, { keyValues: keyObj, items: [] });
        }
        groups.get(groupKey)!.items.push(row);
      });

      const fieldTokens = splitSelectTokens(selectFields);

      resultRows = Array.from(groups.values()).map(({ keyValues, items: groupItems }) => {
        const rowResult: Record<string, any> = {};

        fieldTokens.forEach((token) => {
          const { expr, alias } = parseFieldAlias(token);
          const roundMatch = expr.match(/^ROUND\((.*?)(?:,\s*(\d+))?\)$/i);

          if (roundMatch) {
            const innerExpr = roundMatch[1].trim();
            const decimals = roundMatch[2] ? parseInt(roundMatch[2], 10) : 2;
            const innerVal = computeAggregateOrValue(innerExpr, groupItems, keyValues);
            rowResult[alias] = typeof innerVal === 'number' ? Number(innerVal.toFixed(decimals)) : innerVal;
          } else if (isAggregateExpr(expr)) {
            const val = computeAggregateOrValue(expr, groupItems, keyValues);
            rowResult[alias] = typeof val === 'number' ? Math.round(val * 100) / 100 : val;
          } else {
            const cleanExpr = expr.replace(/[`"']/g, '');
            rowResult[alias] = resolveColumnValue(cleanExpr, keyValues, groupItems[0]);
          }
        });

        return rowResult;
      });
    } else {
      // No GROUP BY: standard projection
      if (selectFields === '*') {
        resultRows = currentRows;
      } else {
        const fieldTokens = splitSelectTokens(selectFields);
        resultRows = currentRows.map((row) => {
          const projected: Record<string, any> = {};
          fieldTokens.forEach((token) => {
            const { expr, alias } = parseFieldAlias(token);
            const cleanExpr = expr.replace(/[`"']/g, '');
            projected[alias] = row[cleanExpr] ?? row[findCaseInsensitiveKey(row, cleanExpr)] ?? '';
          });
          return projected;
        });
      }
    }

    // 3. Parse ORDER BY with multiple columns: e.g. "col1 DESC, col2 ASC"
    const orderByMatch = cleanedQuery.match(/ORDER\s+BY\s+([\s\S]+?)(?=\s+LIMIT|$)/i);
    if (orderByMatch) {
      const orderClauses = orderByMatch[1]
        .split(',')
        .map((clause) => {
          const parts = clause.trim().split(/\s+/);
          const col = parts[0].replace(/[`"']/g, '');
          const isDesc = parts.length > 1 && parts[1].toUpperCase() === 'DESC';
          return { col, isDesc };
        })
        .filter((c) => Boolean(c.col));

      resultRows.sort((a, b) => {
        for (const { col, isDesc } of orderClauses) {
          const valA = a[col] ?? a[findCaseInsensitiveKey(a, col)] ?? 0;
          const valB = b[col] ?? b[findCaseInsensitiveKey(b, col)] ?? 0;

          if (valA === valB) continue;

          if (typeof valA === 'number' && typeof valB === 'number') {
            return isDesc ? valB - valA : valA - valB;
          }

          const numA = Number(valA);
          const numB = Number(valB);
          if (!isNaN(numA) && !isNaN(numB)) {
            return isDesc ? numB - numA : numA - numB;
          }

          const cmp = String(valA).localeCompare(String(valB));
          if (cmp !== 0) {
            return isDesc ? -cmp : cmp;
          }
        }
        return 0;
      });
    }

    // 4. Parse LIMIT
    const limitMatch = cleanedQuery.match(/LIMIT\s+(\d+)/i);
    if (limitMatch) {
      const limitVal = parseInt(limitMatch[1], 10);
      if (!isNaN(limitVal) && limitVal > 0) {
        resultRows = resultRows.slice(0, limitVal);
      }
    }

    const columns = resultRows.length > 0 ? Object.keys(resultRows[0]) : [];
    const executionTimeMs = Math.round(performance.now() - startTime);

    return {
      columns,
      rows: resultRows,
      rowCount: resultRows.length,
      executionTimeMs,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Truy vấn không hợp lệ';
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round(performance.now() - startTime),
      error: `Lỗi cú pháp SQL: ${message}`,
    };
  }
}

/**
 * Phân tích alias từ SELECT token: "SUM(col) AS total" → { expr: "SUM(col)", alias: "total" }
 */
function parseFieldAlias(token: string): { expr: string; alias: string } {
  const aliasMatch = token.match(/^(.*?)\s+(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
  const expr = aliasMatch ? aliasMatch[1].trim() : token.trim();
  const alias = aliasMatch ? aliasMatch[2].trim() : expr;
  return { expr, alias };
}

/**
 * Kiểm tra xem biểu thức có phải hàm tổng hợp (SUM, AVG, COUNT, MAX, MIN)
 */
function isAggregateExpr(expr: string): boolean {
  return /^(SUM|AVG|COUNT|MAX|MIN)\s*\(/i.test(expr);
}

/**
 * Tìm giá trị cột với fallback case-insensitive từ keyValues hoặc row
 */
function resolveColumnValue(
  colName: string,
  primary: Record<string, any>,
  fallbackRow?: Record<string, any>
): any {
  if (primary[colName] !== undefined) return primary[colName];
  const matchKey = findCaseInsensitiveKey(primary, colName);
  if (primary[matchKey] !== undefined) return primary[matchKey];
  if (!fallbackRow) return '';
  return fallbackRow[colName] ?? fallbackRow[findCaseInsensitiveKey(fallbackRow, colName)] ?? '';
}

/**
 * Tính toán giá trị tổng hợp phụ trợ
 */
function computeAggregateOrValue(
  expr: string,
  items: Record<string, any>[],
  keyValues: Record<string, any>
): number | string {
  const sumMatch = expr.match(/^SUM\((.*?)\)$/i);
  const avgMatch = expr.match(/^AVG\((.*?)\)$/i);
  const countMatch = expr.match(/^COUNT\((.*?)\)$/i);
  const maxMatch = expr.match(/^MAX\((.*?)\)$/i);
  const minMatch = expr.match(/^MIN\((.*?)\)$/i);

  if (sumMatch) {
    const col = sumMatch[1].trim().replace(/[`"']/g, '');
    return items.reduce((acc, item) => acc + (Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0) || 0), 0);
  }
  if (avgMatch) {
    const col = avgMatch[1].trim().replace(/[`"']/g, '');
    const sum = items.reduce((acc, item) => acc + (Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0) || 0), 0);
    return items.length ? sum / items.length : 0;
  }
  if (countMatch) {
    return items.length;
  }
  if (maxMatch) {
    const col = maxMatch[1].trim().replace(/[`"']/g, '');
    return Math.max(...items.map((item) => Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0)));
  }
  if (minMatch) {
    const col = minMatch[1].trim().replace(/[`"']/g, '');
    return Math.min(...items.map((item) => Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0)));
  }

  const clean = expr.replace(/[`"']/g, '');
  return keyValues[clean] ?? items[0]?.[clean] ?? 0;
}

/**
 * Tìm key trong object không phân biệt chữ hoa chữ thường
 */
function findCaseInsensitiveKey(obj: Record<string, any>, key: string): string {
  if (!obj) return key;
  const lower = key.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === lower) return k;
  }
  return key;
}

/**
 * Phân tách các biểu thức trong SELECT mà không bị ngắt bởi dấu phẩy bên trong ngoặc đơn
 */
function splitSelectTokens(str: string): string[] {
  const tokens: string[] = [];
  let current = '';
  let parenDepth = 0;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '(') parenDepth++;
    else if (char === ')') parenDepth--;

    if (char === ',' && parenDepth === 0) {
      tokens.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) tokens.push(current.trim());
  return tokens;
}

/**
 * Loại bỏ dấu ngoặc đơn bao bọc bên ngoài nếu toàn bộ biểu thức nằm trong cùng một cặp ngoặc
 */
function unwrapEnclosingParentheses(str: string): string {
  let trimmed = str.trim();
  while (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    let depth = 0;
    let isEnclosed = true;
    for (let i = 0; i < trimmed.length - 1; i++) {
      if (trimmed[i] === '(') depth++;
      else if (trimmed[i] === ')') {
        depth--;
        if (depth === 0) {
          isEnclosed = false;
          break;
        }
      }
    }
    if (isEnclosed && depth === 1) {
      trimmed = trimmed.slice(1, -1).trim();
    } else {
      break;
    }
  }
  return trimmed;
}

/**
 * Xử lý các điều kiện phức hợp kết hợp OR và AND
 */
function evaluateCompoundCondition(row: Record<string, any>, conditionStr: string): boolean {
  const cleanStr = unwrapEnclosingParentheses(conditionStr);

  const orBlocks = splitTopLevel(cleanStr, 'OR');
  if (orBlocks.length > 1) {
    return orBlocks.some((block) => evaluateCompoundCondition(row, block));
  }

  const andBlocks = splitTopLevel(cleanStr, 'AND');
  if (andBlocks.length > 1) {
    return andBlocks.every((block) => evaluateCompoundCondition(row, block));
  }

  return evaluateAtomicCondition(row, cleanStr);
}

/**
 * Tách chuỗi theo toán tử logic (AND/OR) ở cấp cao nhất (không nằm trong ngoặc đơn hoặc dấu nháy)
 */
function splitTopLevel(str: string, op: 'AND' | 'OR'): string[] {
  const regex = new RegExp(`\\s+${op}\\s+`, 'i');
  const tokens: string[] = [];
  let current = '';
  let inParen = 0;
  let inQuote: string | null = null;

  for (let i = 0; i < str.length; i++) {
    const char = str[i];

    if ((char === "'" || char === '"') && !inQuote) {
      inQuote = char;
    } else if (char === inQuote) {
      inQuote = null;
    } else if (char === '(' && !inQuote) {
      inParen++;
    } else if (char === ')' && !inQuote) {
      inParen--;
    }

    if (inParen === 0 && !inQuote) {
      const remaining = str.slice(i);
      const match = remaining.match(regex);
      if (match && remaining.indexOf(match[0]) === 0) {
        // Nếu là toán tử AND, kiểm tra xem AND này có thuộc về mệnh đề BETWEEN hay không
        if (op === 'AND' && /\bBETWEEN\s+['"]?[^'"\s]+['"]?$/i.test(current.trim())) {
          // Đây là AND của BETWEEN ... AND ..., không tách
        } else {
          tokens.push(current.trim());
          current = '';
          i += match[0].length - 1;
          continue;
        }
      }
    }

    current += char;
  }

  if (current.trim()) {
    tokens.push(current.trim());
  }

  return tokens.length > 1 ? tokens : [str];
}

/**
 * Đánh giá một điều kiện nguyên tử đơn lẻ (atomic condition)
 */
function evaluateAtomicCondition(row: Record<string, any>, condition: string): boolean {
  let trimmed = condition.trim();

  // Bỏ bọc ngoặc ngoài cùng nếu có
  if (trimmed.startsWith('(') && trimmed.endsWith(')')) {
    trimmed = trimmed.slice(1, -1).trim();
  }

  // 1. IS NULL / IS NOT NULL
  const isNullMatch = trimmed.match(/^([a-zA-Z0-9_`"]+)\s+IS\s+(NOT\s+)?NULL$/i);
  if (isNullMatch) {
    const col = isNullMatch[1].replace(/[`"']/g, '');
    const isNot = Boolean(isNullMatch[2]);
    const val = row[col] ?? row[findCaseInsensitiveKey(row, col)];
    const isNull = val === null || val === undefined || val === '';
    return isNot ? !isNull : isNull;
  }

  // 2. BETWEEN ... AND ...
  const betweenMatch = trimmed.match(/^([a-zA-Z0-9_`"]+)\s+BETWEEN\s+['"]?([^'"]+)['"]?\s+AND\s+['"]?([^'"]+)['"]?$/i);
  if (betweenMatch) {
    const [, rawCol, lowStr, highStr] = betweenMatch;
    const col = rawCol.replace(/[`"']/g, '');
    const val = Number(row[col] ?? row[findCaseInsensitiveKey(row, col)] ?? 0);
    return val >= Number(lowStr) && val <= Number(highStr);
  }

  // 3. IN (...) / NOT IN (...)
  const inMatch = trimmed.match(/^([a-zA-Z0-9_`"]+)\s+(NOT\s+)?IN\s*\(([\s\S]+)\)$/i);
  if (inMatch) {
    const col = inMatch[1].replace(/[`"']/g, '');
    const isNot = Boolean(inMatch[2]);
    const inValues = inMatch[3]
      .split(',')
      .map((v) => v.trim().replace(/^['"]|['"]$/g, '').toLowerCase());

    const rawVal = row[col] ?? row[findCaseInsensitiveKey(row, col)];
    const strVal = String(rawVal ?? '').toLowerCase();
    const isIncluded = inValues.includes(strVal);
    return isNot ? !isIncluded : isIncluded;
  }

  // 4. Comparison Operators: =, !=, <>, >, <, >=, <=, LIKE
  const compMatch = trimmed.match(/^([a-zA-Z0-9_`"]+)\s*(=|!=|<>|>=|<=|>|<|LIKE)\s*([\s\S]+)$/i);
  if (compMatch) {
    const col = compMatch[1].replace(/[`"']/g, '');
    const op = compMatch[2].toUpperCase();
    let valStr = compMatch[3].trim();

    // Bỏ dấu ngoặc kép hoặc ngoặc đơn quanh giá trị nếu có
    if ((valStr.startsWith("'") && valStr.endsWith("'")) || (valStr.startsWith('"') && valStr.endsWith('"'))) {
      valStr = valStr.slice(1, -1);
    }

    const rawVal = row[col] ?? row[findCaseInsensitiveKey(row, col)];

    if (op === 'LIKE') {
      const pattern = valStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*').replace(/_/g, '.');
      return new RegExp(`^${pattern}$`, 'i').test(String(rawVal ?? ''));
    }

    const isNumericComparison = !isNaN(Number(rawVal)) && !isNaN(Number(valStr)) && rawVal !== '' && valStr !== '';
    if (isNumericComparison) {
      const numA = Number(rawVal);
      const numB = Number(valStr);
      switch (op) {
        case '=':
          return numA === numB;
        case '!=':
        case '<>':
          return numA !== numB;
        case '>':
          return numA > numB;
        case '<':
          return numA < numB;
        case '>=':
          return numA >= numB;
        case '<=':
          return numA <= numB;
        default:
          return false;
      }
    }

    const strA = String(rawVal ?? '').toLowerCase();
    const strB = String(valStr).toLowerCase();
    switch (op) {
      case '=':
        return strA === strB;
      case '!=':
      case '<>':
        return strA !== strB;
      case '>':
        return strA > strB;
      case '<':
        return strA < strB;
      case '>=':
        return strA >= strB;
      case '<=':
        return strA <= strB;
      default:
        return false;
    }
  }

  throw new Error(`Không thể phân tích điều kiện WHERE: "${condition}"`);
}
