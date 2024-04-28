import React from "react";
import Func from "./Func/Func";

interface UI2DProps {
    funcs: { f: (x: number) => number; color: string; width: number; }[];
    changeFunction: () => void;
}

class UI2D extends React.Component
{
constructor(props: UI2DProps) {
super(props);
this.funcs = props.funcs;
this.changeFunction = props.changeFunction;


    this.state = {
        funcs: props.funcs
    }
}

funcs: { f: (x: number) => number; color: string; width: number; }[]; 
changeFunction: () => void; 

addFunctionHandler() {
    // @ts-ignore
    const funcs = [...this.state.funcs];
    const func = {
        f: () => 0,
        color: 'black',
        width: 2
    };
    funcs.push(func);
    this.funcs.push(func);
    this.setState({ funcs });
}

clearFunction(index: number) {
    // @ts-ignore
    const funcs = [...this.state.funcs];
    funcs.splice(index, 1); 
    this.setState({ funcs });
    // @ts-ignore
    this.props.changeFunction({ f: () => 0, color: 'black', width: 2 }); 
}


render() {
    return (
        <>
            <button
                className="beautyButton"
                onClick={() => this.addFunctionHandler()}
            >+</button>
            <div>{
                // @ts-ignore
                this.state.funcs.map((func, index) =>
                    <Func
                        key={index}
                        func={func}
                        changeFunction={() => this.changeFunction()}
                    />
                )
            }</div>
        </>
    );
}
}

export default UI2D;