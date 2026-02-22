import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { Technology } from '../entities/Technology';
import { Question, Difficulty } from '../entities/Question';
import { Tag } from '../entities/Tag';

export const runSeed = async () => {
  try {
    console.log('🌱 Starting database seed...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log('✅ Database connected');

    // Check if database already has data
    const categoryRepo = AppDataSource.getRepository(Category);
    const existingCount = await categoryRepo.count();
    
    if (existingCount > 0) {
      console.log(`✅ Database already has ${existingCount} categories. Skipping seed.`);
      await AppDataSource.destroy();
      return true;
    }

    console.log('📊 Database is empty. Starting seed...');

    // Clear existing data
    await AppDataSource.query('DELETE FROM question_tags');
    await AppDataSource.query('DELETE FROM questions');
    await AppDataSource.query('DELETE FROM tags');
    await AppDataSource.query('DELETE FROM technologies');
    await AppDataSource.query('DELETE FROM categories');
    console.log('🗑️  Cleared existing data');

    // Create repositories
    const technologyRepo = AppDataSource.getRepository(Technology);
    const questionRepo = AppDataSource.getRepository(Question);
    const tagRepo = AppDataSource.getRepository(Tag);

    // Create Categories
    const frontendCategory = categoryRepo.create({
      name: 'Frontend',
      slug: 'frontend',
      description: 'Client-side development technologies',
      order: 1,
    });

    const backendCategory = categoryRepo.create({
      name: 'Backend',
      slug: 'backend',
      description: 'Server-side development technologies',
      order: 2,
    });

    await categoryRepo.save([frontendCategory, backendCategory]);
    console.log('✅ Categories created');

    // Create Technologies - Frontend
    const reactTech = technologyRepo.create({
      name: 'React',
      slug: 'react',
      description: 'A JavaScript library for building user interfaces',
      icon: '⚛️',
      category: frontendCategory,
      order: 1,
    });

    const vueTech = technologyRepo.create({
      name: 'Vue.js',
      slug: 'vuejs',
      description: 'Progressive JavaScript framework',
      icon: '💚',
      category: frontendCategory,
      order: 2,
    });

    const jsTech = technologyRepo.create({
      name: 'JavaScript',
      slug: 'javascript',
      description: 'Core JavaScript language',
      icon: '📜',
      category: frontendCategory,
      order: 3,
    });

    // Create Technologies - Backend
    const nodeTech = technologyRepo.create({
      name: 'Node.js',
      slug: 'nodejs',
      description: "JavaScript runtime built on Chrome's V8 engine",
      icon: '🟢',
      category: backendCategory,
      order: 1,
    });

    const postgresTech = technologyRepo.create({
      name: 'PostgreSQL',
      slug: 'postgresql',
      description: 'Powerful open-source relational database',
      icon: '🐘',
      category: backendCategory,
      order: 2,
    });

    const springTech = technologyRepo.create({
      name: 'Spring Boot',
      slug: 'spring-boot',
      description: 'Java framework for building applications',
      icon: '🍃',
      category: backendCategory,
      order: 3,
    });

    await technologyRepo.save([
      reactTech,
      vueTech,
      jsTech,
      nodeTech,
      postgresTech,
      springTech,
    ]);
    console.log('✅ Technologies created');

    // Create Tags
    const tags = await tagRepo.save([
      { name: 'Fundamentals', slug: 'fundamentals' },
      { name: 'ES6', slug: 'es6' },
      { name: 'Hooks', slug: 'hooks' },
      { name: 'State Management', slug: 'state-management' },
      { name: 'Component Lifecycle', slug: 'component-lifecycle' },
      { name: 'Async Programming', slug: 'async-programming' },
      { name: 'REST API', slug: 'rest-api' },
      { name: 'Database', slug: 'database' },
      { name: 'SQL', slug: 'sql' },
      { name: 'Performance', slug: 'performance' },
      { name: 'Security', slug: 'security' },
      { name: 'Best Practices', slug: 'best-practices' },
    ]);
    console.log('✅ Tags created');

    // Create Questions
    const questions = [
      // JavaScript Questions
      {
        title: 'What is the difference between == and === in JavaScript?',
        answer: `The main difference is that \`==\` performs type coercion while \`===\` does not.

## == (Abstract Equality)

- Compares values after type coercion
- Converts operands to the same type before comparison
- Can lead to unexpected results

## === (Strict Equality)

- Compares both value AND type
- No type conversion
- Recommended for most cases

## Best Practice:
Always use \`===\` unless you specifically need type coercion.`,
        codeSnippet: `// == performs type coercion
5 == '5'     // true (string '5' converted to number)
0 == false   // true
null == undefined  // true
[] == false  // true

// === does NOT perform type coercion
5 === '5'    // false (different types)
0 === false  // false (number vs boolean)
null === undefined  // false
[] === false // false

// Recommended usage
const value = getUserInput();

// Good ✅
if (value === 'admin') {
  grantAccess();
}

// Bad ❌ (might cause bugs)
if (value == 'admin') {
  grantAccess();
}`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.EASY,
        technology: jsTech,
        tags: [tags.find((t) => t.slug === 'es6')!],
      },
      {
        title: 'Explain closures in JavaScript with an example',
        answer: `A closure is a function that has access to variables in its outer (enclosing) lexical scope, even after the outer function has returned.

## Key Concepts:

1. **Lexical Scoping**: Functions are executed using the variable scope in effect when they were defined
2. **Persistent Scope**: Inner functions maintain reference to outer variables
3. **Data Privacy**: Creates private variables

## Common Use Cases:
- Data encapsulation
- Factory functions
- Callbacks with persistent state
- Module pattern`,
        codeSnippet: `// Basic closure example
function createCounter() {
  let count = 0; // Private variable
  
  return {
    increment: function() {
      count++;
      return count;
    },
    decrement: function() {
      count--;
      return count;
    },
    getCount: function() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
console.log(counter.decrement()); // 1

// count is not accessible from outside
console.log(counter.count); // undefined

// Practical example: Event handler with closure
function setupButtons() {
  for (let i = 0; i < 3; i++) {
    const button = document.getElementById(\`btn\${i}\`);
    button.addEventListener('click', function() {
      console.log(\`Button \${i} clicked\`); // 'i' is preserved
    });
  }
}`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.MEDIUM,
        technology: jsTech,
        tags: [
          tags.find((t) => t.slug === 'fundamentals')!,
          tags.find((t) => t.slug === 'es6')!,
        ],
      },

      // React Questions
      {
        title: 'What are React Hooks and why were they introduced?',
        answer: `React Hooks are functions that let you use state and other React features in functional components without writing a class.

## Why Hooks?

1. **Simpler Code**: Less boilerplate than class components
2. **Reusability**: Share stateful logic between components
3. **Better Organization**: Related logic stays together
4. **No \`this\` keyword**: Avoid confusion with \`this\` binding

## Built-in Hooks:
- \`useState\`: Add state to functional components
- \`useEffect\`: Handle side effects
- \`useContext\`: Access context values
- \`useRef\`: Create mutable references
- \`useMemo\`: Memoize expensive calculations
- \`useCallback\`: Memoize functions`,
        codeSnippet: `import React, { useState, useEffect } from 'react';

// Before Hooks (Class Component)
class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }
  
  componentDidMount() {
    document.title = \`Count: \${this.state.count}\`;
  }
  
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        Count: {this.state.count}
      </button>
    );
  }
}

// With Hooks (Functional Component)
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      Count: {count}
    </button>
  );
}`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.MEDIUM,
        technology: reactTech,
        tags: [
          tags.find((t) => t.slug === 'hooks')!,
          tags.find((t) => t.slug === 'fundamentals')!,
        ],
      },

      // Node.js Questions
      {
        title: 'What is middleware in Express.js and how does it work?',
        answer: `Middleware functions are functions that have access to the request object (req), response object (res), and the next middleware function in the application's request-response cycle.

## Characteristics:

1. **Execute code**: Perform any operation
2. **Modify req/res**: Add properties, modify data
3. **End request-response cycle**: Send response
4. **Call next()**: Pass control to next middleware

## Types of Middleware:

1. **Application-level**: \`app.use()\`
2. **Router-level**: \`router.use()\`
3. **Error-handling**: Takes 4 parameters (err, req, res, next)
4. **Built-in**: express.json(), express.static()
5. **Third-party**: cors, helmet, morgan`,
        codeSnippet: `import express from 'express';

const app = express();

// 1. Application-level middleware
app.use((req, res, next) => {
  console.log('Time:', Date.now());
  next(); // Must call next() to pass control
});

// 2. Built-in middleware
app.use(express.json());

// 3. Custom middleware
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  // Verify token...
  req.user = { id: 1, name: 'John' };
  next();
};

// 4. Route-specific middleware
app.get('/protected', authMiddleware, (req, res) => {
  res.json({ message: 'Protected data', user: req.user });
});

// 5. Error-handling middleware (must be last)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something broke!' });
});`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.MEDIUM,
        technology: nodeTech,
        tags: [tags.find((t) => t.slug === 'rest-api')!],
      },
      {
        title: 'Explain the Event Loop in Node.js',
        answer: `The Event Loop is the mechanism that allows Node.js to perform non-blocking I/O operations despite JavaScript being single-threaded.

## How it Works:

1. **Call Stack**: Executes synchronous code
2. **Callback Queue**: Holds callbacks from async operations
3. **Event Loop**: Continuously checks if call stack is empty and moves callbacks from queue to stack

## Phases of Event Loop:

1. **Timers**: Executes setTimeout/setInterval callbacks
2. **Pending Callbacks**: Executes I/O callbacks
3. **Idle, Prepare**: Internal operations
4. **Poll**: Retrieve new I/O events
5. **Check**: Execute setImmediate() callbacks
6. **Close Callbacks**: Handle close events`,
        codeSnippet: `// Event Loop Example
console.log('1: Start');

setTimeout(() => {
  console.log('2: Timeout');
}, 0);

setImmediate(() => {
  console.log('3: Immediate');
});

Promise.resolve().then(() => {
  console.log('4: Promise');
});

process.nextTick(() => {
  console.log('5: NextTick');
});

console.log('6: End');

// Output order:
// 1: Start
// 6: End
// 5: NextTick (microtask, highest priority)
// 4: Promise (microtask)
// 2: Timeout (timer phase)
// 3: Immediate (check phase)

// Non-blocking I/O example
const fs = require('fs');

console.log('Reading file...');
fs.readFile('file.txt', 'utf8', (err, data) => {
  console.log('File content:', data);
});
console.log('Continue execution...');

// Output:
// Reading file...
// Continue execution...
// File content: [file contents]`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.HARD,
        technology: nodeTech,
        tags: [
          tags.find((t) => t.slug === 'async-programming')!,
          tags.find((t) => t.slug === 'fundamentals')!,
        ],
      },

      // PostgreSQL Questions
      {
        title: 'Explain ACID properties in PostgreSQL',
        answer: `ACID is a set of properties that guarantee database transactions are processed reliably.

## A - Atomicity

- Transaction is "all or nothing"
- Either all operations succeed or all fail
- No partial updates

## C - Consistency

- Database moves from one valid state to another
- All constraints, triggers, cascades are respected
- Data integrity is maintained

## I - Isolation

- Concurrent transactions don't interfere with each other
- Each transaction appears to execute in isolation
- Controlled by isolation levels

## D - Durability

- Once committed, data persists even after crashes
- Written to non-volatile storage
- Can be recovered after system failure`,
        codeSnippet: `-- Example: Bank transfer demonstrating ACID

BEGIN; -- Start transaction (Atomicity)

-- Deduct from account A
UPDATE accounts 
SET balance = balance - 100 
WHERE account_id = 'A';

-- Add to account B
UPDATE accounts 
SET balance = balance + 100 
WHERE account_id = 'B';

-- Check constraint (Consistency)
-- Trigger ensures balance never negative

COMMIT; -- Make changes permanent (Durability)
-- If any operation fails, ROLLBACK occurs (Atomicity)

-- Isolation levels in PostgreSQL:
SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
-- READ UNCOMMITTED
-- READ COMMITTED (default)
-- REPEATABLE READ
-- SERIALIZABLE`,
        codeLanguage: 'sql',
        difficulty: Difficulty.MEDIUM,
        technology: postgresTech,
        tags: [
          tags.find((t) => t.slug === 'database')!,
          tags.find((t) => t.slug === 'sql')!,
        ],
      },
      {
        title: 'What are indexes in PostgreSQL and when should you use them?',
        answer: `An index is a database structure that improves the speed of data retrieval operations on a table.

## Types of Indexes:

1. **B-tree** (default): General purpose, supports <, <=, =, >=, >
2. **Hash**: Only equality comparisons
3. **GiST**: Geometric data, full-text search
4. **GIN**: Array values, full-text search
5. **BRIN**: Very large tables with natural ordering

## When to Use:

✅ **Use indexes on:**
- Columns frequently used in WHERE clauses
- Foreign key columns
- Columns used in JOIN conditions
- Columns used in ORDER BY

❌ **Avoid indexes on:**
- Small tables
- Columns with many NULL values
- Frequently updated columns
- Low cardinality columns`,
        codeSnippet: `-- Create basic index
CREATE INDEX idx_users_email ON users(email);

-- Create unique index
CREATE UNIQUE INDEX idx_users_username ON users(username);

-- Composite index (multiple columns)
CREATE INDEX idx_orders_user_date 
ON orders(user_id, order_date);

-- Partial index (with condition)
CREATE INDEX idx_active_users 
ON users(email) 
WHERE is_active = true;

-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM users WHERE email = 'user@example.com';

-- View all indexes on a table
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'users';

-- Drop unused index
DROP INDEX IF EXISTS idx_users_old_column;`,
        codeLanguage: 'sql',
        difficulty: Difficulty.MEDIUM,
        technology: postgresTech,
        tags: [
          tags.find((t) => t.slug === 'database')!,
          tags.find((t) => t.slug === 'performance')!,
          tags.find((t) => t.slug === 'best-practices')!,
        ],
      },
    ];

    await questionRepo.save(questions);
    console.log('✅ Questions created');

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${await categoryRepo.count()}`);
    console.log(`   - Technologies: ${await technologyRepo.count()}`);
    console.log(`   - Questions: ${await questionRepo.count()}`);
    console.log(`   - Tags: ${await tagRepo.count()}`);

    await AppDataSource.destroy();
    
    return true;
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  }
};

// Only run directly if not imported
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
