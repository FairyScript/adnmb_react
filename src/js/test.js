import React, { useEffect,useReducer } from 'react';

function Test() {
    
    function Count(props) {
        return <>Count: {props.count} </>
    }
    function Counter() {
        const initialState = { count: 0 };
        const [state, dispatch] = useReducer(reducer, initialState);
        function reducer(state, action) {
            switch (action.type) {
                case 'increment':
                    return {...state,count: state.count+1};
                case 'decrement':
                    return { count: state.count - 1 };
                default:
                    throw new Error();
            }
        }
        useEffect(()=> {
            console.log(state);
        },[state]);

        return (
            <>
                <Count count={state.count} />
                <button onClick={() => dispatch({ type: 'increment' })}>+</button>
                <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
            </>
        );
    }

    return <Counter />
}

export { Test };