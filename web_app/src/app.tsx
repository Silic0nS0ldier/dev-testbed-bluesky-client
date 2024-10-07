import { h } from "vendor/preact";
import { useCallback, useState } from "vendor/preact/hooks";

export function App() {
    const [num, setNum] = useState(0);
    const increment = useCallback(() => setNum(num + 1), [num, setNum]);
    return (
        <div>
            <h1>Hello, World!</h1>
            <button onClick={increment}>Increment</button>
            {num}
        </div>
    );
}
