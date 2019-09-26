class App {
    constructor(root, config) {
        this.root = root;
        this.config = config;

        this.state = {
            baseUnit: config.units.baseUnit,
            units: this.getUnits(config.units, config.units.baseUnit),
            input: { unit: config.units.baseUnit, amount: 1 },
            output: { unit: '', amount: 0 }
        };


        // setup handlers
        this.addClickHandler();
        this.addChangeHandler();

        // set default output unit to second unit
        this.update({
            outputUnit: [...this.state.units.keys()][1]
        });
    }

    addClickHandler() {
        document.addEventListener('click', (event) => {
            if (event.target.matches('#setViewAdd')) {
                this.setState({ view: 'add' });
            }

            if (event.target.matches('#setViewList')) {
                this.setState({ view: 'list' });
            }

            if (event.target.matches('#createItem')) {
                this.createItem(event);
            }

        }, false);
    }

    addChangeHandler() {
        document.addEventListener('change', (event) => {

            // set input amount
            if (event.target.matches('#setInputAmount')) {

               this.update({ inputAmount: event.target.value });
            }

            // set input unit
            if (event.target.matches('#setInputUnit')) {

               this.update({ inputUnit: event.target.value });
            }

            // set output unit
            if (event.target.matches('#setOutputUnit')) {

               this.update({ outputUnit: event.target.value });
            }

        }, false);
    }

    getUnits(units, baseUnit) {
        return [units]
        // convert string lists to arrays
        .map(unitStrings => {
            return Object.keys(unitStrings)
            .reduce((obj, key) => {
                obj[key] = unitStrings[key].split(',');
                return obj;
            }, {});
        })
        // create unit items
        .map(data => {
            return data.unitNames
            .map((name, idx) => {
                return {
                    name: name.trim(),
                    value: parseFloat(data.unitValues[idx].trim())
                }
            })
        })
        // prepend base unit
        .map(data => {
            return [
                {
                    name: baseUnit,
                    value: 1
                },
                ...data
            ]
        })
        // convert to map
        .map(pair => {
            return pair
            .reduce((map, pair) => {
                map.set(pair.name, pair.value)
                return map
            }, new Map())
        })
        .reduce(r => r)
    }

    update({ inputAmount, inputUnit, outputUnit }) {
        let amount = this.state.input.amount;
        let input = this.state.input.unit;
        let output = this.state.output.unit;

        // update input amount
        if (inputAmount) {
            this.setState({
                input: {
                    unit: input,
                    amount: inputAmount
                },
                output: {
                    unit: output,
                    amount: this.convert(inputAmount, input, output)
                }
            })
        }

        // update input unit
        if (inputUnit) {
            this.setState({
                input: {
                    unit: inputUnit,
                    amount: amount
                },
                output: {
                    unit: output,
                    amount: this.convert(amount, inputUnit, output)
                }
            })
        }

        // update input unit
        if (outputUnit) {
            this.setState({
                input: {
                    unit: input,
                    amount: amount
                },
                output: {
                    unit: outputUnit,
                    amount: this.convert(amount, input, outputUnit)
                }
            })
        }
    }

    convert(amount, inputUnit, outputUnit) {
        return amount * this.state.units.get(inputUnit) / this.state.units.get(outputUnit);
    }

    setState(state) {
        // create updates
        let updates = {
            ...this.state,
            ...state
        }

        // reject non-changes
        if (JSON.stringify(updates) === JSON.stringify(this.state)) { return; }

        // update state and re-render
        this.state = updates;
        this.render();
    }

    render() {
        let units = [...this.state.units.keys()]

        this.root.innerHTML = `
        <div class="container">
            <h1>${this.config.settings.name}</h1>
            <input id="setInputAmount" value="${this.state.input.amount}"></input>
            <select id="setInputUnit">
                ${units.map(unit => {
                    return `
                        <option value="${unit}" ${unit === this.state.input.unit ? 'selected' : ''}>${unit}</option>
                    `
                }).join('')}
            </select>
            <div>${this.config.settings.equalsText}</div>
            <div>${Number.parseFloat(this.state.output.amount).toFixed(2)}</div>
            <select id="setOutputUnit">
                ${units.map(unit => {
                    return `
                        <option value="${unit}" ${unit === this.state.output.unit ? 'selected' : ''}>${unit}</option>
                    `
                }).join('')}
            </select>
        </div>
        `
    }
}

module.exports.default = App;