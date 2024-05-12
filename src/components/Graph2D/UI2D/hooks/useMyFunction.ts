import { TF } from "../../Graph2D";

const useMyFunction = (): [(str: string) => TF, (f: TF) => string] => {

    const getFunction = (str: string): TF => {
        let f = function (x: number): number { return 0; };
        try {
            const _f = eval(`f = function(x) {return ${str};}`);
            f = _f;
            return f;
        } catch (e) {
            //console.log('ошибка ввода', e);
            return f;
        }
    }

    const getFunctionBody = (f: TF): string => {
        return f.toString().replaceAll(' ', '').split('return')[1].split(';')[0];
    }

    return [getFunction, getFunctionBody];
}

export default useMyFunction;