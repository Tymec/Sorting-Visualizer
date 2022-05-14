import React from 'react';
import Soundfont from "soundfont-player";
import './SortingVisualizer.css';
import './Algorithms';
import * as algo from './Algorithms';
import { sleep, range } from './Utils.js';

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
            audioContext: undefined,
            abortCtrl: undefined,
            stats: {
                comparisons: 0,
                swaps: 0,
                accesses: 0
            },
        };

        this.algorithms = {
            bubble: algo.BubbleSort,
            cocktail: algo.CocktailSort,
            selection: algo.SelectionSort,
            insertion: algo.InsertionSort,
            merge: algo.MergeSort,
            mergeInPlace: algo.MergeSortInPlace,
            quickHoare: algo.QuickSortHoare,
            quickIter: algo.QuickSortIterative,
            count: algo.CountSort,
            radixLSD: algo.RadixSortLSD,
        }
    }

    componentDidMount() {
        this.setState({abortCtrl: new AbortController(), audioContext: new AudioContext()});
        this.initArray(this.state.size);
    }

    getBarWidth() {
        const {innerWidth} = window;
        const {size} = this.state;

        let margin = 1;
        let padding = 10 * 2 + size * margin;
        return ( innerWidth - padding ) / size;
    }

    getBarHeight(value, padding=100) {
        const {innerHeight} = window;
        const {size} = this.state;
        
        return (innerHeight - padding) * (value / size);
    }

    getStyle(value, index) {
        switch (this.state.type) {
            case 'bar':
                return {
                    height: `${this.getBarHeight(value)}px`, 
                    width: `${this.getBarWidth()}px`, 
                    backgroundColor: this.state.colors[index]
                };
            case 'dot':
                let size = this.getBarWidth();
                const {innerHeight} = window;
                return {
                    height: `${size}px`, 
                    width: `${size}px`,
                    borderRadius: '50%',
                    marginTop: `${innerHeight - 100 - this.getBarHeight(value, 125)}px`,
                    backgroundColor: this.state.colors[index]
                };
            default:
                return {};
        }
    }

    initArray(size) {
        const array = []; const colors = [];
        for (let i = 1; i < size + 1; i++) {
            array.push(i);
            colors.push('#ffffff');
        }

        this.setState({array, colors, size, isRunning: false, isSorted: true, stats: this.resetStats()});
    }

    resetStats() {
        let stats = {
            comparison: 0,
            swap: 0,
            access: 0
        }
        return stats;
    }

    playNote(note) {
        const {audioContext, size} = this.state;
        // Soundfont.instrument(audioContext, "electric_grand_piano", { gain: 2, attack: 0, decay: 0.1, sustain: 0.1, release: 0.1 }).then((piano) => {
        //     piano.play(range(note, 0, size, 24, 107), audioContext.currentTime, { duration: 0.1 });
        // });
    }
    
    setColor(index, color) {
        const {colors} = this.state;
        colors[index] = color;
        this.setState({colors});
    }

    resetColors() {
        const {colors} = this.state;
        for (let i = 0; i < colors.length; i++) {
            colors[i] = '#ffffff';
        }
        this.setState({colors});
    }

    resetColor(index) {
        if ( index < 0 ) return;

        const {colors} = this.state;
        colors[index] = '#ffffff';
        this.setState({colors});
    }

    async finishAnimation() {
        const {colors} = this.state;
        const signal = this.state.abortCtrl.signal;

        for (let i = 0; i < colors.length; i++) {
            colors[i] = '#00ff00';
            this.setState({colors});
            this.playNote(i);
            await sleep(this.state.delay, signal);
            colors[i] = '#ffffff';
        }
        this.setState({colors});
    }

    async sort() {
        if ( this.state.isSorted ) await this.shuffle();
        this.setState({isRunning: true});

        const p = {
            array: this.state.array,
            delay: this.state.delay,
            stats: this.state.stats,

            signal: this.state.abortCtrl.signal,

            update: () => this.setState({array: p.array, stats: p.stats}),
            playNote: this.playNote.bind(this),
            setColor: this.setColor.bind(this),
            resetColor: this.resetColor.bind(this),
            resetColors: this.resetColors.bind(this),
        };
        
        try {
            await this.algorithms[this.state.algorithm](p);

            await this.finishAnimation();
            this.setState({isSorted: true});
        } catch (e) {
            if ( e.name !== 'AbortError' ) throw e;
        }
        this.resetColors();
        this.setState({isRunning: false, abortCtrl: new AbortController()});
    }

    // From https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
    async shuffle() {
        if ( this.state.isRunning ) return;
        this.setState({isRunning: true, isSorted: false});

        const {array, delay, abortCtrl} = this.state;
        try {
            let currentIndex = array.length;
            let randomIndex;
            for (let i = array.length - 1; i > 0; i--) {
                // TODO: use render function to render shuffling the array
                
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex--;

                [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
                this.setColor(currentIndex, '#ffa500');
                this.setColor(randomIndex, '#ffa500');
                if ( delay > 4 ) {
                    await sleep(delay, abortCtrl.signal);
                } 
                this.resetColor(currentIndex);
                this.resetColor(randomIndex);
            }
        } catch (e) {
            if ( e.name !== 'AbortError' ) throw e;
        }

        this.setState({array, stats: this.resetStats(), isRunning: false});
    }

    render() {
        return (
            <div className="visualizer">
                <ul className="stats">
                    <li className="stat-item stat-delay">Delay: {this.state.delay}</li>
                    <li className="stat-item stat-comparisons">Comparisons: {this.state.stats.comparison}</li>
                    <li className="stat-item stat-swaps">Swaps: {this.state.stats.swap}</li>
                    <li className="stat-item stat-accesses">Accesses: {this.state.stats.access}</li>
                </ul>
                <div className="controls">
                    <button className="control-value" name="stop" disabled={!this.state.isRunning} onClick={() => this.state.abortCtrl.abort()}>Stop</button>
                    <button className="control-value" name="sort" disabled={this.state.isRunning} onClick={() => this.sort()}>Sort</button>
                    <button className="control-value" name="shuffle" disabled={this.state.isRunning} onClick={async () => await this.shuffle()}>Shuffle</button>

                    <label htmlFor="type">Type: </label>
                    <select className="control-value" name="type" value={this.state.type} onChange={(e) => this.setState({type: e.target.value})}>
                        <option value="bar">Bar</option>
                        <option value="dot">Dot</option>
                    </select>

                    <label htmlFor="size">Size: </label>
                    <input className="control-value" name="size" type="number" min="1" max="1000" disabled={this.state.isRunning} value={this.state.size} onChange={(e) => {
                        let { value, min, max } = e.target;
                        value = Math.max(Number(min), Math.min(Number(max), Number(value)));

                        this.initArray(value);
                    }} />

                    <label htmlFor="delay">Delay: </label>
                    <input className="control-value" name="delay" type="number" min="4" max="1000" disabled={this.state.isRunning} value={this.state.delay} onChange={(e) => this.setState({delay: Number(e.target.value)})} />
                    
                    <label htmlFor="algorithm">Algorithm: </label>
                    <select className="control-value" name="algo" value={this.state.algorithm} disabled={this.state.isRunning} onChange={(e) => this.setState({algorithm: e.target.value})}>
                        <option value="bubble">Bubble Sort</option>
                        <option value="cocktail">Cocktail Sort</option>
                        <option value="selection">Selection Sort</option>
                        <option value="insertion">Insertion Sort</option>
                        <option value="merge">Merge Sort</option>
                        <option value="mergeInPlace">In-Place Merge Sort</option>
                        <option value="quickHoare">Quick Sort Hoare</option>
                        <option value="quickIter">Iterative Quick Sort</option>
                        <option value="count">Count Sort</option>
                        <option value="radixLSD">Radix Sort LSD</option>
                    </select>
                </div>
                <div className="array-container" style={{minHeight: `100%` }}>
                    <div className={`array-value array-${this.state.type}`} key="-1" style={{height: 0, width: 0, backgroundColor: 'transparent'}}></div>
                    {this.state.array?.map((value, index) => (
                        <div 
                            className={`array-value array-${this.state.type}`} 
                            key={index}
                            style={this.getStyle(value, index)}>
                        </div>
                    ))}
                    <div className={`array-value array-${this.state.type}`} key={this.state.size + 1} style={{height: `${this.getBarHeight(this.state.size)}px`, backgroundColor: 'transparent'}}></div>
                </div>
            </div>
        );
    }
};