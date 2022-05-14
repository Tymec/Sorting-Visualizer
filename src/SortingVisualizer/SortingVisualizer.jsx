import React from 'react';
//import Soundfont from "soundfont-player";
import './SortingVisualizer.css';
import { AnimationController, SwapEvent, AnimationEvent } from './Animation';
import * as algo from './Algorithms';

export default class SortingVisualizer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            algorithm: 'bubble',
            array: [],
            colors: [],
            size: 100,
            delay: 10,
            type: 'bar',
            isRunning: false,
            isSorted: true,
            animationController: undefined,
            args: {}
        };

        this.algorithms = {
            bubble: {
                name: "Bubble Sort",
                run: algo.BubbleSort
            },
            cocktail: {
                name: "Cocktail Sort",
                run: algo.CocktailSort
            },
            selection: {
                name: "Selection Sort",
                run: algo.SelectionSort
            },
            insertion: {
                name: "Insertion Sort",
                run: algo.InsertionSort
            },
            merge: {
                name: "Merge Sort",
                run: algo.MergeSort
            },
            mergeInPlace: {
                name: "Merge Sort (in-place)",
                run: algo.MergeSortInPlace
            },
            quickHoare: {
                name: "Quick Sort (Hoare)",
                run: algo.QuickSortHoare
            },
            quickIter: {
                name: "Quick Sort (iterative)",
                run: algo.QuickSortIterative
            },
            count: {
                name: "Counting Sort",
                run: algo.CountingSort
            },
            radixLSD: {
                name: "Radix Sort (LSD)",
                run: algo.RadixSortLSD,
                args: {
                    base: 10
                }
            },
        }
    }

    componentDidMount() {
        this.setState({animationController: new AnimationController(this.state.delay, this.setState.bind(this), this.state.colors)});
        this.initArray(this.state.size);
    }

    initArray(size) {
        const array = []; const colors = [];
        for (let i = 1; i < size + 1; i++) {
            array.push(i);
            colors.push('#ffffff');
        }

        this.setState({array, colors, size, isRunning: false, isSorted: true});
    }

    getBarWidth() {
        const {innerWidth} = window;
        const {size} = this.state;

        let margin = this.getBarMargin();
        let padding = 10 * 2 + size * margin;
        return ( innerWidth - padding ) / size;
    }

    getBarHeight(value, padding=100) {
        const {innerHeight} = window;
        const {size} = this.state;
        
        return (innerHeight - padding) * (value / size);
    }

    getBarMargin() {
        const {size} = this.state;
        let margin = 1500 / size;
        return margin;
    }

    getStyle(value, index) {
        switch (this.state.type) {
            case 'bar':
                return {
                    height: `${this.getBarHeight(value, 125)}px`, 
                    width: `${this.getBarWidth()}px`,
                    marginLeft: `${this.getBarMargin() / 2}px`,
                    marginRight: `${this.getBarMargin() / 2}px`,
                    backgroundColor: this.state.colors[index]
                };
            case 'dot':
                let size = this.getBarWidth();
                const {innerHeight} = window;
                return {
                    height: `${size}px`, 
                    width: `${size}px`,
                    borderRadius: '50%',
                    marginLeft: `${this.getBarMargin() / 2}px`,
                    marginRight: `${this.getBarMargin() / 2}px`,
                    marginTop: `${innerHeight - 100 - this.getBarHeight(value, 125)}px`,
                    backgroundColor: this.state.colors[index]
                };
            default:
                return {};
        }
    }

    setAlgorithm(alg) {
        this.setState({algorithm: alg, args: this.algorithms[alg]?.args || {}});
        this.initArray(this.state.size);
    }

    setDelay(del) {
        const {animationController} = this.state;
        animationController.setSpeed(del);
        this.setState({delay: del});
    }

    sort() {
        if ( this.state.isSorted ) this.shuffle();

        const p = {
            array: this.state.array,
            animations: [new AnimationEvent('init-array', {array: this.state.array.slice()})]
        };
        
        try {
            this.algorithms[this.state.algorithm].run({...p, ...this.state?.args});

            this.setState({isSorted: true});
        } catch (e) {
            if ( e.name !== 'AbortError' ) throw e;
        }
    }

    // From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    shuffle() {
        if ( this.state.isRunning ) return;

        const {array, animationController} = this.state;
        if ( animationController.isPaused ) {
            animationController.resume();
            return;
        }

        this.setState({isSorted: false});
        
        const animations = [new AnimationEvent('init-array', {array: array.slice(0)})];
        
        try {
            let currentIndex = array.length;
            let randomIndex;
            for (let i = array.length - 1; i > 0; i--) {
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                animations.push(new SwapEvent({a: currentIndex, b: randomIndex}));
                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
            }
        } catch (e) {
            if ( e.name !== 'AbortError' ) throw e;
        }
        animationController.animate(animations);
    }

    render() {
        const self = this;

        return (
            <div className="visualizer">
                <div className="controls">
                    <button className="control-value control-sort" name="sort"
                        onClick={() => { 
                            if ( self.state.isRunning ) {
                                self.state.animationController.stop();
                            } else {
                                self.sort();
                            }
                        }}>
                        {self.state.isRunning ? 'Stop' : 'Sort'}
                    </button>
                    <button className="control-value control-shuffle" name="shuffle" 
                    onClick={() => {
                        if ( self.state.animationController?.isPaused ) {
                            self.state.animationController.resume();
                        } else if ( self.state.animationController?.isRunning && self.state.isRunning ) {
                            self.state.animationController.pause();
                        } else {
                            self.shuffle();
                        }
                    }}>
                    {!self.state.animationController?.isPaused && !self.state.animationController?.isRunning ? 'Shuffle' : 'Pause'}
                    </button>

                    <label className="control-label" htmlFor="type">Type: </label>
                    <select className="control-value control-type" name="type" value={self.state.type} onChange={(e) => self.setState({type: e.target.value})}>
                        <option value="bar">Bar</option>
                        <option value="dot">Dot</option>
                    </select>

                    <label className="control-label" htmlFor="size">Size: </label>
                    <input className="control-value control-size" name="size" type="number" min="2" max="5000" disabled={self.state.isRunning} value={self.state.size} onChange={(e) => {
                        let { value, min, max } = e.target;
                        value = Math.max(Number(min), Math.min(Number(max), Number(value)));

                        self.initArray(value);
                    }}/>

                    <label className="control-label" htmlFor="delay">Delay: </label>
                    <input className="control-value control-delay" name="delay" type="number" min="4" max="1000" disabled={self.state.isRunning} value={self.state.delay} onChange={(e) => self.setDelay(Number(e.target.value))} />
                    
                    <label className="control-label" htmlFor="algorithm">Algorithm: </label>
                    <select className="control-value control-algo" name="algo" value={self.state.algorithm} disabled={self.state.isRunning} onChange={(e) => self.setAlgorithm(e.target.value)}>
                        {Object.keys(self.algorithms).map(key => <option key={key} value={key}>{self.algorithms[key].name}</option>)}
                    </select>
                    <div className="control-value control-args" name="args">
                        {Object.keys(self.state.args).map(key => (
                            <div key={key} className="control-args-item">
                                <label className="control-label" htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}: </label>
                                <input className="control-value control-args-value" name={key} type="number" disabled={self.state.isRunning} value={self.state.args[key]}
                                onChange={(e) => self.setState({args: {...self.state.args, [key]: Number(e.target.value)}})}/>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="array-container" style={{minHeight: `100%` }}>
                    <div className="array-value array-bar" key="-1" style={{height: 0, backgroundColor: 'transparent'}}></div>
                    {self.state.array?.map((value, index) => (
                        <div 
                            className={`array-value array-${self.state.type}`} 
                            key={index}
                            style={self.getStyle(value, index)}>
                        </div>
                    ))}
                    <div className={`array-value array-${self.state.type}`} key={self.state.size + 1} style={{height: `${self.getBarHeight(self.state.size)}px`, backgroundColor: 'transparent'}}></div>
                </div>
            </div>
        );
    }
};