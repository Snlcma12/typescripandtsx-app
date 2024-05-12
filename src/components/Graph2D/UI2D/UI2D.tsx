import React, { useState } from "react";
import { TFunction } from "../Graph2D";
import useMyFunction from "./hooks/useMyFunction";
import Func from "./Func/Func";

export type TUI2D = {
    funcs: TFunction[];
    //funcs: Array<TFunction>;
    reRender: () => void;
}

const UI2D: React.FC<TUI2D> = (props: TUI2D) => {
    const { funcs, reRender } = props;
    const [count, setCount] = useState<number>(funcs.length);
    const [getFunction] = useMyFunction();

    const addFunction = () => {
        const func = {
            f: getFunction('0'),
            color: 'black',
            width: 2
        };
        funcs.push(func);
        setCount(funcs.length);
    }

    const delFunction = (index: number) => {
        funcs.splice(index, 1);
        setCount(funcs.length);
        reRender();
    }

    return (<>
        <button
            className="beautyButton"
            onClick={addFunction}
        >+</button>
        <div>{
            funcs.map((func, index) =>
                <Func
                    key={`${index}${Math.random().toString()}`}
                    index={index}
                    func={func}
                    reRender={reRender}
                    delFunction={delFunction}
                />
            )
        }</div>
    </>);
}

export default UI2D