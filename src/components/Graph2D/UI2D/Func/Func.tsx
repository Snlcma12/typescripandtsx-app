import React from "react";

interface FuncProps {
    func: { f: (x: number) => number; color: string; width: number; };
    changeFunction: () => void;
}

class Func extends React.Component<FuncProps> {
    constructor(props: FuncProps) {
        super(props);
    }

    keyupHandler(event: React.KeyboardEvent<HTMLInputElement>) {
        try {
            let f;
            eval(`f = function(x) {return ${event.currentTarget.value};}`);
            // @ts-ignore
            this.props.func.f = f;
            this.props.changeFunction();
        } catch (e) {
            console.log('ошибка ввода', e);
        }
    }

    render() {
        return (
            <div>
                <input onKeyUp={(event) => this.keyupHandler(event)} placeholder="f(x)" />
                <input placeholder="color" />
                <input placeholder="width" />
            </div>
        );
    }
}

export default Func;
