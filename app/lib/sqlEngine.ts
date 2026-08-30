/**
 * Client-side In-Memory SQL Execution Engine
 * Thực thi các câu lệnh SQL thực tế (SELECT, WHERE, GROUP BY, ORDER BY, LIMIT, hàm tổng hợp SUM, AVG, COUNT, MIN, MAX)
 * trực tiếp trên các mảng dữ liệu JSON hoặc tệp CSV người dùng tải lên.
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

    // 1. Check for WHERE clause
    const whereMatch = cleanedQuery.match(/WHERE\s+([\s\S]+?)(?=\s+GROUP\s+BY|\s+ORDER\s+BY|\s+LIMIT|$)/i);
    if (whereMatch) {
      const whereCondition = whereMatch[1].trim();
      currentRows = currentRows.filter(row => evaluateCondition(row, whereCondition));
    }

    // 2. Check for GROUP BY
    const groupByMatch = cleanedQuery.match(/GROUP\s+BY\s+([\s\S]+?)(?=\s+ORDER\s+BY|\s+LIMIT|$)/i);
    const selectMatch = cleanedQuery.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
    const selectFields = selectMatch ? selectMatch[1].trim() : '*';

    let resultRows: Record<string, any>[] = [];

    if (groupByMatch) {
      const groupCol = groupByMatch[1].trim().split(',')[0].trim();
      const groups: Record<string, Record<string, any>[]> = {};

      currentRows.forEach(row => {
        const key = String(row[groupCol] ?? row[findCaseInsensitiveKey(row, groupCol)] ?? 'Other');
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });

      // Parse aggregates in SELECT (e.g. SUM(col) AS total, AVG(col) AS avg_col, COUNT(*) AS count)
      const fieldTokens = splitSelectTokens(selectFields);

      resultRows = Object.entries(groups).map(([groupKey, groupItems]) => {
        const rowResult: Record<string, any> = {};
        
        fieldTokens.forEach(token => {
          const aliasMatch = token.match(/^(.*?)\s+(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
          const expr = aliasMatch ? aliasMatch[1].trim() : token.trim();
          const alias = aliasMatch ? aliasMatch[2].trim() : expr;

          const sumMatch = expr.match(/^SUM\((.*?)\)$/i);
          const avgMatch = expr.match(/^AVG\((.*?)\)$/i);
          const countMatch = expr.match(/^COUNT\((.*?)\)$/i);
          const maxMatch = expr.match(/^MAX\((.*?)\)$/i);
          const minMatch = expr.match(/^MIN\((.*?)\)$/i);

          if (sumMatch) {
            const col = sumMatch[1].trim();
            const sum = groupItems.reduce((acc, item) => {
              const val = Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0);
              return acc + (isNaN(val) ? 0 : val);
            }, 0);
            rowResult[alias] = Math.round(sum * 100) / 100;
          } else if (avgMatch) {
            const col = avgMatch[1].trim();
            const sum = groupItems.reduce((acc, item) => {
              const val = Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0);
              return acc + (isNaN(val) ? 0 : val);
            }, 0);
            rowResult[alias] = groupItems.length ? Math.round((sum / groupItems.length) * 100) / 100 : 0;
          } else if (countMatch) {
            rowResult[alias] = groupItems.length;
          } else if (maxMatch) {
            const col = maxMatch[1].trim();
            const maxVal = Math.max(...groupItems.map(item => Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0)));
            rowResult[alias] = isFinite(maxVal) ? maxVal : 0;
          } else if (minMatch) {
            const col = minMatch[1].trim();
            const minVal = Math.min(...groupItems.map(item => Number(item[col] ?? item[findCaseInsensitiveKey(item, col)] ?? 0)));
            rowResult[alias] = isFinite(minVal) ? minVal : 0;
          } else if (expr.toLowerCase() === groupCol.toLowerCase() || expr === '*') {
            rowResult[alias] = groupKey;
          } else {
            rowResult[alias] = groupItems[0]?.[expr] ?? groupItems[0]?.[findCaseInsensitiveKey(groupItems[0] || {}, expr)] ?? groupKey;
          }
        });

        return rowResult;
      });
    } else {
      // No Group By, standard projection
      if (selectFields === '*') {
        resultRows = currentRows;
      } else {
        const fieldTokens = splitSelectTokens(selectFields);
        resultRows = currentRows.map(row => {
          const projected: Record<string, any> = {};
          fieldTokens.forEach(token => {
            const aliasMatch = token.match(/^(.*?)\s+(?:AS\s+)?([a-zA-Z0-9_]+)$/i);
            const expr = aliasMatch ? aliasMatch[1].trim() : token.trim();
            const alias = aliasMatch ? aliasMatch[2].trim() : expr;
            
            projected[alias] = row[expr] ?? row[findCaseInsensitiveKey(row, expr)] ?? '';
          });
          return projected;
        });
      }
    }

    // 3. Check for ORDER BY
    const orderByMatch = cleanedQuery.match(/ORDER\s+BY\s+([\s\S]+?)(?=\s+LIMIT|$)/i);
    if (orderByMatch) {
      const orderDef = orderByMatch[1].trim();
      const parts = orderDef.split(/\s+/);
      const orderCol = parts[0];
      const isDesc = parts.length > 1 && parts[1].toUpperCase() === 'DESC';

      resultRows.sort((a, b) => {
        const valA = a[orderCol] ?? a[findCaseInsensitiveKey(a, orderCol)] ?? 0;
        const valB = b[orderCol] ?? b[findCaseInsensitiveKey(b, orderCol)] ?? 0;
        
        if (typeof valA === 'number' && typeof valB === 'number') {
          return isDesc ? valB - valA : valA - valB;
        }
        return isDesc
          ? String(valB).localeCompare(String(valA))
          : String(valA).localeCompare(String(valB));
      });
    }

    // 4. Check for LIMIT
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
  } catch (err: any) {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.round(performance.now() - startTime),
      error: `Lỗi thực thi SQL: ${err.message || 'Cú pháp không hợp lệ'}`,
    };
  }
}

function findCaseInsensitiveKey(obj: Record<string, any>, key: string): string {
  const lower = key.toLowerCase();
  for (const k of Object.keys(obj)) {
    if (k.toLowerCase() === lower) return k;
  }
  return key;
}

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

function evaluateCondition(row: Record<string, any>, condition: string): boolean {
  // Simple conditions: col >= val, col = 'val', col LIKE '%val%'
  const betweenMatch = condition.match(/([a-zA-Z0-9_]+)\s+BETWEEN\s+['"]?([^'"]+)['"]?\s+AND\s+['"]?([^'"]+)['"]?/i);
  if (betweenMatch) {
    const [, col, low, high] = betweenMatch;
    const val = Number(row[col] ?? row[findCaseInsensitiveKey(row, col)] ?? 0);
    return val >= Number(low) && val <= Number(high);
  }

  const comparisonMatch = condition.match(/([a-zA-Z0-9_]+)\s*(=|!=|>|<|>=|<=|LIKE)\s*['"]?([^'"]+)?['"]?/i);
  if (comparisonMatch) {
    const [, col, op, valStr] = comparisonMatch;
    const rawVal = row[col] ?? row[findCaseInsensitiveKey(row, col)];
    const targetVal = isNaN(Number(valStr)) ? valStr : Number(valStr);

    switch (op.toUpperCase()) {
      case '=':
        return String(rawVal).toLowerCase() === String(targetVal).toLowerCase();
      case '!=':
        return String(rawVal).toLowerCase() !== String(targetVal).toLowerCase();
      case '>':
        return Number(rawVal) > Number(targetVal);
      case '<':
        return Number(rawVal) < Number(targetVal);
      case '>=':
        return Number(rawVal) >= Number(targetVal);
      case '<=':
        return Number(rawVal) <= Number(targetVal);
      case 'LIKE': {
        const pattern = String(targetVal).replace(/%/g, '.*');
        return new RegExp(`^${pattern}$`, 'i').test(String(rawVal));
      }
      default:
        return true;
    }
  }

  return true;
}
