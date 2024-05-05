import React, { useState } from "react";
import { TFunction } from "../Graph2D";
import Func from "./Func/Func";

export type TUI2D = {
    funcs: TFunction[];
    //funcs: Array<TFunction>;
    changeFunction: () => void;
}

const UI2D: React.FC<TUI2D> = (props: TUI2D) => {
    const { funcs, changeFunction } = props;
    const [count, setCount] = useState<number>(funcs.length);

    const addFunctionHandler = () => {
        const func = {
            f: (x: number) => 0,
            color: 'black',
            width: 2
        };
        funcs.push(func);
        setCount(funcs.length);
    }

    return (<>
        <button
            className="beautyButton"
            onClick={addFunctionHandler}
        >+</button>
        <div>{
            funcs.map((func, index) =>
                <Func
                    key={index}
                    func={func}
                    changeFunction={changeFunction}
                />
            )
        }</div>
    </>);
}

export default UI2D