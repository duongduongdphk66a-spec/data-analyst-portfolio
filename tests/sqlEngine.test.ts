import { describe, it, expect } from 'vitest';
import { executeClientSql } from '../app/lib/sqlEngine';

describe('executeClientSql Engine', () => {
  const sampleData = [
    { id: 1, name: 'Product A', category: 'Electronics', price: 100, quantity: 5, status: 'active' },
    { id: 2, name: 'Product B', category: 'Electronics', price: 200, quantity: 2, status: 'inactive' },
    { id: 3, name: 'Product C', category: 'Clothing', price: 50, quantity: 10, status: 'active' },
    { id: 4, name: 'Product D', category: 'Clothing', price: 80, quantity: 4, status: 'active' },
    { id: 5, name: 'Product E', category: 'Home', price: 150, quantity: 1, status: 'pending' },
  ];

  it('should reject non-SELECT queries', () => {
    const res = executeClientSql('DELETE FROM products', sampleData);
    expect(res.error).toBeDefined();
    expect(res.rowCount).toBe(0);
  });

  it('should return error on empty table data', () => {
    const res = executeClientSql('SELECT * FROM empty', []);
    expect(res.error).toBeDefined();
  });

  it('should project SELECT * without modifications', () => {
    const res = executeClientSql('SELECT * FROM products;', sampleData);
    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(5);
    expect(res.columns).toEqual(['id', 'name', 'category', 'price', 'quantity', 'status']);
  });

  it('should project specific columns and handle aliases', () => {
    const res = executeClientSql('SELECT name, price AS unit_price FROM products', sampleData);
    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(5);
    expect(res.columns).toEqual(['name', 'unit_price']);
    expect(res.rows[0]).toEqual({ name: 'Product A', unit_price: 100 });
  });

  it('should filter with WHERE equality and numeric operators', () => {
    const res = executeClientSql('SELECT * FROM products WHERE price > 100', sampleData);
    expect(res.rowCount).toBe(2);
    expect(res.rows.map((r) => r.id)).toEqual([2, 5]);
  });

  it('should handle compound WHERE with AND and OR', () => {
    const res = executeClientSql(
      "SELECT * FROM products WHERE (category = 'Clothing' AND price >= 80) OR price = 200",
      sampleData
    );
    expect(res.rowCount).toBe(2);
    expect(res.rows.map((r) => r.id)).toEqual([2, 4]);
  });

  it('should handle WHERE IN and NOT IN clauses', () => {
    const resIn = executeClientSql("SELECT * FROM products WHERE category IN ('Electronics', 'Home')", sampleData);
    expect(resIn.rowCount).toBe(3);

    const resNotIn = executeClientSql("SELECT * FROM products WHERE category NOT IN ('Electronics', 'Home')", sampleData);
    expect(resNotIn.rowCount).toBe(2);
  });

  it('should handle WHERE BETWEEN clauses', () => {
    const res = executeClientSql('SELECT * FROM products WHERE price BETWEEN 60 AND 160', sampleData);
    expect(res.rowCount).toBe(3);
    expect(res.rows.map((r) => r.id)).toEqual([1, 4, 5]);
  });

  it('should handle WHERE LIKE pattern matching', () => {
    const res = executeClientSql("SELECT * FROM products WHERE name LIKE '%uct A'", sampleData);
    expect(res.rowCount).toBe(1);
    expect(res.rows[0].name).toBe('Product A');
  });

  it('should handle GROUP BY with aggregates (SUM, AVG, COUNT, MAX, MIN, ROUND)', () => {
    const res = executeClientSql(
      'SELECT category, COUNT(*) AS total_items, SUM(price) AS sum_price, ROUND(AVG(price), 1) AS avg_price FROM products GROUP BY category',
      sampleData
    );

    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(3); // Electronics, Clothing, Home

    const electronics = res.rows.find((r) => r.category === 'Electronics');
    expect(electronics).toBeDefined();
    expect(electronics?.total_items).toBe(2);
    expect(electronics?.sum_price).toBe(300);
    expect(electronics?.avg_price).toBe(150);
  });

  it('should handle ORDER BY ASC and DESC with LIMIT', () => {
    const res = executeClientSql('SELECT name, price FROM products ORDER BY price DESC LIMIT 3', sampleData);
    expect(res.rowCount).toBe(3);
    expect(res.rows[0].name).toBe('Product B');
    expect(res.rows[0].price).toBe(200);
    expect(res.rows[1].name).toBe('Product E');
    expect(res.rows[1].price).toBe(150);
    expect(res.rows[2].name).toBe('Product A');
    expect(res.rows[2].price).toBe(100);
  });

  it('should support aggregate-only queries without GROUP BY', () => {
    const res = executeClientSql(
      'SELECT COUNT(*) AS total_count, SUM(price) AS total_revenue, ROUND(AVG(price), 1) AS avg_price FROM products',
      sampleData
    );
    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(1);
    expect(res.rows[0].total_count).toBe(5);
    expect(res.rows[0].total_revenue).toBe(580);
    expect(res.rows[0].avg_price).toBe(116);
  });

  it('should handle NULL and empty values correctly in COUNT(col), AVG, MIN, MAX', () => {
    const dataWithNulls = [
      { id: 1, val: 10, bonus: null },
      { id: 2, val: 20, bonus: 100 },
      { id: 3, val: null, bonus: 200 },
      { id: 4, val: 30, bonus: '' },
    ];
    const res = executeClientSql(
      'SELECT COUNT(*) AS total_rows, COUNT(val) AS count_val, COUNT(bonus) AS count_bonus, AVG(val) AS avg_val, MIN(val) AS min_val, MAX(val) AS max_val FROM test',
      dataWithNulls
    );
    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(1);
    expect(res.rows[0].total_rows).toBe(4);
    expect(res.rows[0].count_val).toBe(3); // 10, 20, 30
    expect(res.rows[0].count_bonus).toBe(2); // 100, 200 (null and '' excluded)
    expect(res.rows[0].avg_val).toBe(20); // (10+20+30)/3
    expect(res.rows[0].min_val).toBe(10);
    expect(res.rows[0].max_val).toBe(30);
  });

  it('should support LIMIT 0 returning empty rows array with preserved columns', () => {
    const res = executeClientSql('SELECT name, price FROM products LIMIT 0', sampleData);
    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(0);
    expect(res.rows).toEqual([]);
    expect(res.columns).toEqual(['name', 'price']);
  });

  it('should avoid key collisions in multi-column GROUP BY with delimiter characters', () => {
    const collisionData = [
      { a: 'x___y', b: 'z', val: 10 },
      { a: 'x', b: 'y___z', val: 20 },
    ];
    const res = executeClientSql(
      'SELECT a, b, SUM(val) AS total FROM t GROUP BY a, b',
      collisionData
    );
    expect(res.error).toBeUndefined();
    expect(res.rowCount).toBe(2);
  });
});

