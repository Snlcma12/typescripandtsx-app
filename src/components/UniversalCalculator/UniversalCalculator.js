import { useRef } from "react";
import Calculator from "../../modules/Calculator/Calculator";
import PolynomialCalculator from "../../modules/Calculator/PolynomialCalculator";

import './UniversalCalculator.css';

const UniversalCalculator = () => {
    const number1Ref = useRef();
    const number2Ref = useRef();
    const resultRef = useRef();
    const countPolyValueRef = useRef();
    const polyAreaRef = useRef();

    const clearAllBtnHandler = () => {
        number1Ref.current.value = '';
        number2Ref.current.value = '';
        resultRef.current.value = '';
    }

    const clearAllPolyBtnHandler = () => {
        polyAreaRef.current.value = '';
        countPolyValueRef.current.value = '';
    }

    const operandHandler = (operand) => {
        const calc = new Calculator()
        const num1 = calc.getValue(number1Ref.current.value);
        const num2 = calc.getValue(number2Ref.current.value);
        const result = calc[operand](num1, num2);
        resultRef.current.value = result ? result.toString() : 'АшЫПкО!!!';
    }

    const polyOperandHandler = () => {
        const calc = new PolynomialCalculator();
        let str = polyAreaRef.current.value;
        const arr = str.replace(' ', '').split('\n');
        if (arr.length < 3) return;
        const num1 = calc.getValue(arr[0]);
        const num2 = calc.getValue(arr[2]);
        let operand = 'add';
        switch (arr[1]) {
            case '+': operand = 'add'; break;
            case '-': operand = 'sub'; break;
            case '*': operand = 'mult'; break;
            case 'scal': operand = 'prod'; break;
            case '^': operand = 'pow'; break;
        }
        const result = calc[operand](num1, num2);
        str = [arr[0], arr[1], arr[2]].join('\n')
        if (result) {
            str += `\n=\n${result.toString()}`;
            polyAreaRef.current.value = str;
        }
    }

    const valueHandler = () => {
        const calc = new PolynomialCalculator();
        const str = polyAreaRef.current.value;
        const a = calc.getValue(str.includes('=') ?
            str.split('=')[1] :
            (str.split('\n').length === 1) ? str.split('\n')[0] : NaN
        );
        const p = (new Calculator).getValue(countPolyValueRef.current.value);
        if (!(p)) {
            countPolyValueRef.current.value = NaN;
            return;
        }
        const result = a.getValue(p);
        if (result) {
            countPolyValueRef.current.value = result.toString();
        }
    }

    return (
        <div>
            <div className="block_">
                <h3>общий калькулятор</h3>
                <div className="block">
                    <textarea ref={number1Ref} className="area" placeholder="num1" rows="2"
                        cols="20"></textarea>
                    <div className="operands-block">
                        <button onClick={() => operandHandler('add')} className='CalcBtn'>+</button>
                        <button onClick={() => operandHandler('sub')} className='CalcBtn'>-</button>
                        <button onClick={() => operandHandler('mult')} className='CalcBtn'>*</button>
                        <button onClick={() => operandHandler('div')} className='CalcBtn'>/</button>
                        <button onClick={() => operandHandler('pow')} className='CalcBtn'>^</button>
                        <button onClick={() => operandHandler('prod')} className='CalcBtn'>.</button>
                    </div>
                    <textarea ref={number2Ref} className="area" placeholder="num2" rows="2"
                        cols="20"></textarea>
                    <span>=</span>
                    <textarea ref={resultRef} className="area" placeholder="result" rows="2" cols="20"
                        readOnly></textarea>
                    <button onClick={clearAllBtnHandler} className='CalcBtn'>Clear All</button>
                </div>
            </div>
            <div className="block_">
                <h3>калькулятор полиномов</h3>
                <div className="block">
                    <button onClick={valueHandler} className='CalcBtn'>считать значение</button>
                    <textarea ref={countPolyValueRef} className="area" placeholder="x" rows="2"
                        cols="20"></textarea>
                    <textarea ref={polyAreaRef} className="area"
                        placeholder="poly1&#013;+&#013;poly2&#013;=&#013;result"
                        rows="4" cols="30"></textarea>
                    <button onClick={polyOperandHandler} className='CalcBtn'>считать полином</button>
                    <button onClick={clearAllPolyBtnHandler} className='CalcBtn'>clear all</button>
                </div>
            </div>
        </div>
    );
}

export default UniversalCalculator;