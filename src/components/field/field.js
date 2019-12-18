import React, {Component} from 'react';
import './field.css';
import Square from "../square/square";


export default class Field extends Component {

    state = {
        grid: (() => {
            let array = [];
            for (let i = 0; i < 10; i++) {
                array[i] = [];
                for (let j = 0; j < 10; j++) {
                    array[i][j] = {type: 'empty-square', key: i + '' + j};
                }
            }
            return array
        })()
        ,
        ships: [
            {name: "fourDeck", deck: 4, num: 1},
            {name: "threeDeck", deck: 3, num: 2},
            {name: "twoDeck", deck: 2, num: 3},
            {name: "oneDeck", deck: 1, num: 4}
        ]
    };

    setShipSquare(arrSip) {
        let newGrid = [...this.state.grid];
        for (let {cords} of arrSip) {
            for (let cord of cords) {
                /*let oldSquare = this.state.grid[cord[0]][cord[1]];
                newGrid = [
                    ...newGrid.slice(0, cord[0]),
                    [
                        ...newGrid[cord[0]].slice(0, cord[1]),
                        {...oldSquare, type: 'grid-ship'},
                        ...newGrid[cord[0]].slice(cord[1] + 1)
                    ],
                    ...newGrid.slice(cord[0] + 1),
                ];*/
                newGrid[cord[0]][cord[1]].type = 'grid-ship';
            }
        }


        this.setState({
            grid: newGrid
        });
    }


    createShip (decks, allShips) {
        let ship = {numDeck: decks, cords: [], shipField:[]};

        let dirs = [
            {name: 'top', type: 'ver', change: -1},
            {name: 'down', type: 'ver', change: 1},
            {name: 'left', type: 'gor', change: -1},
            {name: 'right', type: 'gor', change: 1}];

        function random() {
            return Math.round(Math.random() * 9)
        }

        let startCreating = () => {  //функція щоб перерендювати якщо всі 4 сторони злетіли

            function getShipField([i,j]){
                return[
                    [i-1,j-1],[i-1,j],[i-1,j+1],
                    [i,j-1],   [i,j],  [i,j+1],
                    [i+1,j-1],[i+1,j],[i+1,j+1]
                ]
            }

            function searchDuplicate([i,j]){
                if(!allShips.length){
                    return 0;
                }
                let arrSquare = allShips.map(({shipField})=>shipField).reduce((prev,next) => prev.concat(next)).map(JSON.stringify);  // array all ship fields format string
                return arrSquare.includes(`[${i},${j}]`)
            }
            function setDir({name, type, change}) {

                function delDir(arr, dir) {
                    return arr.filter((item) => item.name !== dir);
                }


                if (type === 'ver') {
                    for (let s = 1; s < numDeck; s++) {
                        if (i + change * s > 9 || i + change * s < 0 || searchDuplicate([i + change * s, j])) {
                            dirs = delDir(dirs, name);
                            cords.splice(1);
                            break;
                        }
                        cords.push([i + change * s, j]);
                        shipField.push(...getShipField([i + change * s, j]));// поле корабля
                    }
                }
                if (type === 'gor') {
                    for (let s = 1; s < numDeck; s++) {

                        if (j + change * s > 9 || j + change * s < 0 || searchDuplicate([i, j + change * s])) {
                            dirs = delDir(dirs, name);
                            cords.splice(1);
                            break;
                        }
                        cords.push([i, j + change * s]);
                        shipField.push(...getShipField([i, j + change * s]));// поле корабля
                    }
                }

            }

            let i = random()
                , j = random();

            let {cords, numDeck,shipField} = ship;

            while ( searchDuplicate([i,j])) {
                i = random();
                j = random();
            }

            cords.push([i, j]);
            shipField.push(...getShipField([i, j])); // поле корабля




            while (cords.length < numDeck) {
                if (!dirs.length) {
                    cords.splice(0);
                    break
                }
                setDir(dirs[Math.round(Math.random() * (dirs.length - 1))]);
            }

        };

        startCreating();

        while (!dirs.length) {
            dirs = [
                {name: 'top', type: 'ver', change: -1},
                {name: 'down', type: 'ver', change: 1},
                {name: 'left', type: 'gor', change: -1},
                {name: 'right', type: 'gor', change: 1}];

            startCreating()
        }

        ship.shipField = Array.from((new Set(ship.shipField.map(JSON.stringify))), JSON.parse);  // remove duplicate
        return ship;
    }

    generateAllShip() {
        const {ships} = this.state;

        let allShips = [];

        for (let type of ships) {
            for (let ship = 0; ship < type.num; ship++) {
                allShips.push(this.createShip(type.deck,  allShips))
            }
        }

        console.log((allShips.map(({shipField})=>shipField).reduce((prev,next) => prev.concat(next)).map(JSON.stringify)).includes('[0,0]'));
        return allShips;
    }





    setDot = (id) => {
        this.setState(({grid}) => {
            const newArray = [
                ...grid.slice(0, id),
                {type: 'grid-dot', id: id},
                ...grid.slice(id + 1)
            ];

            return {
                grid: newArray
            }
        })
    };

    createImgField(array) {
        return array.map((arr) => {
            return arr.map(({type, key}) => {
                return <Square type={type} key={key}/>
            })
        })
    }


    componentDidMount() {
        this.setShipSquare(this.generateAllShip())
    }

    render() {
        const {grid} = this.state;

        const square = this.createImgField(grid);

        console.log(grid);

        return (
            <div className={'field'}>
                {square}
            </div>
        )
    }
}
