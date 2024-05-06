import React, { KeyboardEvent } from "react";
import { TFunction } from "../../Graph2D";
import { TUI2D } from "../UI2D";
import { render } from "@testing-library/react";

type TFunc = Omit<TUI2D, 'funcs'> & { 
    func: TFunction;
}

const Func: React.FC<TFunc> = (props: TFunc) => {
    const { func, changeFunction } = props;

    const keyupHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        try {
            let f = (x: number) => 0;
            eval(`f = function(x) {return ${event.currentTarget.value};}`);
            func.f = f;
            changeFunction();
        } catch (e) {
            //console.log('ошибка ввода', e);
        }
    }

   









    
    return (<div>
        <input onKeyUp={keyupHandler} placeholder="f(x)" />
        <input placeholder="color" />
        <input placeholder="width" />
    </div>);
}

export default Func