import React, { KeyboardEvent } from "react";
import { TFunction } from "../../Graph2D";
import { TUI2D } from "../UI2D";
import useMyFunction from "../hooks/useMyFunction";

type TFunc = Omit<TUI2D, 'funcs'> & { 
    func: TFunction;
    delFunction: (index: number) => void;
    index: number;
}

const Func: React.FC<TFunc> = (props: TFunc) => {
    const { func, reRender, delFunction, index } = props;
    const [getFunction, getFunctionBody] = useMyFunction();

    const changeFunction = (event: KeyboardEvent<HTMLInputElement>) => {
        func.f = getFunction(event.currentTarget.value);
        reRender();
    }

    const changeColor = (event: KeyboardEvent<HTMLInputElement>) => {
        const color = event.currentTarget.value;
        func.color = color;
        reRender();
    }

    const changeWidth = (event: KeyboardEvent<HTMLInputElement>) => {

    }

    return (<div>
        <input 
            placeholder="f(x)" 
            onKeyUp={changeFunction} 
            defaultValue={getFunctionBody(func.f)}
        />
        <input 
            placeholder="color" 
            onKeyUp={changeColor} 
            defaultValue={func.color}
        />
        <input 
            placeholder="width" 
            onKeyUp={changeWidth} 
            defaultValue={func.width}
        />
        <button onClick={() => delFunction(index)}>delete</button>
    </div>);
}

export default Func