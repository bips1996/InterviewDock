import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Category } from '../entities/Category';
import { Technology } from '../entities/Technology';
import { Question, Difficulty } from '../entities/Question';
import { Tag } from '../entities/Tag';

const seed = async () => {
  try {
    console.log(' 🌱 Starting database seed...');

    await AppDataSource.initialize();
    console.log('✅ Database connected');

    // Clear existing data
    await AppDataSource.query('DELETE FROM question_tags');
    await AppDataSource.query('DELETE FROM questions');
    await AppDataSource.query('DELETE FROM tags');
    await AppDataSource.query('DELETE FROM technologies');
    await AppDataSource.query('DELETE FROM categories');
    console.log('🗑️  Cleared existing data');

    // Create repositories
    const categoryRepo = AppDataSource.getRepository(Category);
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
      categoryId: frontendCategory.id,
      order: 1,
    });

    const vueTech = technologyRepo.create({
      name: 'Vue.js',
      slug: 'vuejs',
      description: 'Progressive JavaScript framework',
      icon: '💚',
      categoryId: frontendCategory.id,
      order: 2,
    });

    const jsTech = technologyRepo.create({
      name: 'JavaScript',
      slug: 'javascript',
      description: 'Core JavaScript language',
      icon: '📜',
      categoryId: frontendCategory.id,
      order: 3,
    });

    // Create Technologies - Backend
    const nodeTech = technologyRepo.create({
      name: 'Node.js',
      slug: 'nodejs',
      description: 'JavaScript runtime built on Chrome\'s V8 engine',
      icon: '🟢',
      categoryId: backendCategory.id,
      order: 1,
    });

    const postgresTech = technologyRepo.create({
      name: 'PostgreSQL',
      slug: 'postgresql',
      description: 'Powerful open-source relational database',
      icon: '🐘',
      categoryId: backendCategory.id,
      order: 2,
    });

    const springTech = technologyRepo.create({
      name: 'Spring Boot',
      slug: 'spring-boot',
      description: 'Java framework for building applications',
      icon: '🍃',
      categoryId: backendCategory.id,
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
      { name: 'Hooks', slug: 'hooks' },
      { name: 'State Management', slug: 'state-management' },
      { name: 'Performance', slug: 'performance' },
      { name: 'Async', slug: 'async' },
      { name: 'ES6', slug: 'es6' },
      { name: 'DOM', slug: 'dom' },
      { name: 'Event Loop', slug: 'event-loop' },
      { name: 'Promises', slug: 'promises' },
      { name: 'REST API', slug: 'rest-api' },
      { name: 'Database', slug: 'database' },
      { name: 'ORM', slug: 'orm' },
      { name: 'SQL', slug: 'sql' },
    ]);
    console.log('✅ Tags created');

    // Create Questions - React
    const reactQuestions = [
      {
        title: 'What is the Virtual DOM and how does React use it?',
        answer: `The Virtual DOM is a lightweight copy of the actual DOM kept in memory. React uses it to optimize rendering performance.

## How it works:

1. **Initial Render**: React creates a Virtual DOM tree
2. **State Change**: When state changes, React creates a new Virtual DOM tree
3. **Diffing**: React compares the new tree with the previous one
4. **Reconciliation**: React calculates the minimum number of changes needed
5. **Update**: Only the changed elements are updated in the real DOM

## Benefits:

- **Performance**: Batch updates reduce expensive DOM operations
- **Abstraction**: Developers don't need to manually manipulate the DOM
- **Cross-platform**: Same model works for React Native, React VR, etc.`,
        codeSnippet: `// Example: React automatically handles Virtual DOM
function Counter() {
  const [count, setCount] = useState(0);
  
  // React will efficiently update only the count text
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.MEDIUM,
        technologyId: reactTech.id,
        tags: [tags[2]], // Performance
      },
      {
        title: 'Explain the difference between useMemo and useCallback',
        answer: `Both are React hooks for performance optimization through memoization, but they serve different purposes.

## useMemo

- **Purpose**: Memoizes the **result** of a computation
- **Returns**: The memoized value
- **Use when**: Expensive calculations that shouldn't run on every render

## useCallback

- **Purpose**: Memoizes the **function itself**
- **Returns**: The memoized function
- **Use when**: Passing callbacks to child components to prevent re-renders

## Key Difference:

\`\`\`javascript
useMemo(() => computeExpensiveValue(a, b), [a, b]) // Returns computed value
useCallback(() => doSomething(a, b), [a, b])       // Returns the function
\`\`\``,
        codeSnippet: `import { useMemo, useCallback } from 'react';

function MyComponent({ items, onItemClick }) {
  // useMemo: Memoize calculated value
  const expensiveTotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price, 0);
  }, [items]);

  // useCallback: Memoize function reference
  const handleClick = useCallback((id) => {
    onItemClick(id);
  }, [onItemClick]);

  return (
    <div>
      <p>Total: {expensiveTotal}</p>
      {items.map(item => (
        <Item 
          key={item.id} 
          item={item} 
          onClick={handleClick} 
        />
      ))}
    </div>
  );
}`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.MEDIUM,
        technologyId: reactTech.id,
        tags: [tags[0], tags[2]], // Hooks, Performance
      },
      {
        title: 'What are React Hooks and why were they introduced?',
        answer: `React Hooks are functions that let you use state and other React features in functional components.

## Why Hooks were introduced:

1. **Reusing stateful logic**: Hard to reuse stateful logic between components (wrapper hell with HOCs)
2. **Complex components**: Lifecycle methods mixed different concerns
3. **Class confusion**: Classes confuse both people and machines

## Main Hooks:

- **useState**: Add state to functional components
- **useEffect**: Perform side effects
- **useContext**: Access context
- **useReducer**: Complex state logic
- **useRef**: Mutable refs that persist across renders`,
        codeSnippet: `// Before Hooks (Class Component)
class Counter extends React.Component {
  state = { count: 0 };
  
  componentDidMount() {
    document.title = \`Count: \${this.state.count}\`;
  }
  
  componentDidUpdate() {
    document.title = \`Count: \${this.state.count}\`;
  }
  
  render() {
    return (
      <button onClick={() => this.setState({ count: this.state.count + 1 })}>
        {this.state.count}
      </button>
    );
  }
}

// After Hooks (Functional Component)
function Counter() {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);
  
  return (
    <button onClick={() => setCount(count + 1)}>
      {count}
    </button>
  );
}`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.EASY,
        technologyId: reactTech.id,
        tags: [tags[0]], // Hooks
      },
    ];

    // Create Questions - JavaScript
    const jsQuestions = [
      {
        title: 'Explain the JavaScript Event Loop',
        answer: `The Event Loop is the mechanism that handles asynchronous operations in JavaScript's single-threaded environment.

## Components:

1. **Call Stack**: Executes synchronous code
2. **Web APIs**: Handle async operations (setTimeout, fetch, etc.)
3. **Callback Queue (Task Queue)**: Stores callbacks from Web APIs
4. **Microtask Queue**: Stores promises, mutation observers (higher priority)
5. **Event Loop**: Checks if call stack is empty, then moves tasks from queues

## Execution Order:

1. Execute all synchronous code
2. Execute all microtasks (Promises)
3. Execute one macrotask (setTimeout, setInterval)
4. Repeat

## Key Point:
JavaScript can be non-blocking despite being single-threaded!`,
        codeSnippet: `console.log('1'); // Synchronous

setTimeout(() => {
  console.log('2'); // Macrotask
}, 0);

Promise.resolve().then(() => {
  console.log('3'); // Microtask
});

console.log('4'); // Synchronous

// Output: 1, 4, 3, 2
// Explanation:
// 1. Sync code runs first: 1, 4
// 2. Microtasks (Promise) run: 3
// 3. Macrotasks (setTimeout) run: 2`,
        codeLanguage: 'javascript',
        difficulty: Difficulty.HARD,
        technologyId: jsTech.id,
        tags: [tags[3], tags[6]], // Async, Event Loop
      },
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
        technologyId: jsTech.id,
        tags: [tags[4]], // ES6
      },
    ];

    // Create Questions - Node.js
    const nodeQuestions = [
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
        technologyId: nodeTech.id,
        tags: [tags[8]], // REST API
      },
    ];

    // Create Questions - PostgreSQL
    const postgresQuestions = [
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
        technologyId: postgresTech.id,
        tags: [tags[9], tags[11]], // Database, SQL
      },
    ];

    // Save all questions
    for (const q of reactQuestions) {
      const question = questionRepo.create(q);
      await questionRepo.save(question);
    }

    for (const q of jsQuestions) {
      const question = questionRepo.create(q);
      await questionRepo.save(question);
    }

    for (const q of nodeQuestions) {
      const question = questionRepo.create(q);
      await questionRepo.save(question);
    }

    for (const q of postgresQuestions) {
      const question = questionRepo.create(q);
      await questionRepo.save(question);
    }

    console.log('✅ Questions created');

    console.log('\n🎉 Seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   - Categories: ${await categoryRepo.count()}`);
    console.log(`   - Technologies: ${await technologyRepo.count()}`);
    console.log(`   - Questions: ${await questionRepo.count()}`);
    console.log(`   - Tags: ${await tagRepo.count()}`);

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
};

seed();
