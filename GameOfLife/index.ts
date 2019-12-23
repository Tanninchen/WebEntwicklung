class cgolpitch extends HTMLElement {
    constructor() {
        super();
        console.log('cgolpitch created');
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        console.log('cgolpitch connected');

        var shdow = this.shadowRoot!.innerHTML = `
        <div class="container">
        <div id="match-grid">
        </div>
      </div>
`;
        window.onload = () => this.init();
        window.onresize = () => this.calculateGrid();
    }

    init() {

        var rows = 25;
        var columns = 60;
        gameLogic.rows = rows;
        gameLogic.columns = columns;
        this.setClickEvents();
        var generation: any = document.getElementById('generation');
        generation.innerHTML = "Generation: " + gameLogic.generation.toString();
        cgolpitch.generateField(document.getElementById('match-grid'), rows, columns);
        var gridSize: any = document.getElementById("grid-size");
        gridSize.innerHTML  = (rows.toString() + "X" + columns.toString());
    }

    setClickEvents() {
        document.getElementById('start-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.start();
        });
        document.getElementById('pause-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.pause();
        });

        document.getElementById('clear-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.clear();
        });
        document.getElementById('set-size-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.SetSize();
        });
    }

    static generateField(grid: any, rows: any, columns: any) {
        console.log('create matchfield');

        while (grid.firstChild) {
            grid.removeChild(grid.firstChild);
        }

        var array = new Array(rows);
        var nextGrid = new Array(rows);
        let matchfield = grid;

        matchfield.style.width = Number(columns) + 'em';
        matchfield.style.height = Number(rows) + 'em';

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                let divcell = document.createElement("div");
                divcell.className = 'cell';
                divcell.style.backgroundColor = "#dae8e2";
                divcell.id = (Number(i) + ';' + Number(j));
                divcell.onclick = () => gameLogic.SetState(divcell);
                matchfield.appendChild(divcell);
            }
        }

        document.body.appendChild(matchfield);

        for (var i: number = 0; i < rows; i++) {
            array[i] = [];
            nextGrid[i] = []
            for (var j: number = 0; j < columns; j++) {
                array[i][j] = state.dead;
                nextGrid[i][j] = state.dead;
            }
        }

        gameLogic.grid = array;
        gameLogic.nextGrid = nextGrid;

    }

    static get observedAttributes() {
        return [];
    }

    calculateGrid() {

    }

    attributeChangedCallback(name: any, oldValue: any, newValue: any) {
    }

    disconnectedCallback() {
    }

}
customElements.define('cgol-pitch', cgolpitch);

enum state {
    dead,
    alive,
    oncealive
}

class gameLogic {

    public static grid: any;
    public static rows: number;
    public static columns: number;
    public static nextGrid: any;
    public static rundGame: boolean;
    public static interval: any;
    public static generation: number = 0;

    public() {

    }
    constructor() {
    }
    static run() {

        this.interval = setInterval(() => this.generateNextGeneration(), 200);

    }

    static generateNextGeneration() {
        this.applyRules();
        this.copyAndResetGrid();
        this.updateView();
        var generation: any = document.getElementById('generation');
        generation.innerHTML = "Generation: " + gameLogic.generation.toString();
    }

    static updateView() {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                let idCell = i.toString() + ";" + j.toString();
                var cell: any = document.getElementById(idCell);
                if (this.grid[i][j] === state.dead) {
                    //cell.setAttribute("class", "dead");
                    cell.style.backgroundColor = "#dae8e2";
                } else if (this.grid[i][j] === state.oncealive) {
                    // cell.setAttribute("class", "live");
                    cell.style.background = '#D93919';
                }
                else {
                    cell.style.background = '#4fdc1b';
                }
            }
        }
    }

    static copyAndResetGrid() {
        var lifeState: any;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                if (this.grid[i][j] === state.oncealive) {
                    lifeState = state.oncealive;
                } else if (this.grid[i][j] === state.dead) {
                    lifeState = state.dead;
                }
                this.grid[i][j] = this.nextGrid[i][j];
                this.nextGrid[i][j] = lifeState;
            }
        }
    }

    static applyRules() {
        for (var i: number = 0; i < this.rows; i++) {
            for (var j: number = 0; j < this.columns; j++) {
                var numberOfNighbors = this.countNeighbors(this.grid, i, j);
                let idCell = i.toString() + ";" + j.toString();
                var cell: any = document.getElementById(idCell);

                if (this.grid[i][j] === state.alive) {
                    if (numberOfNighbors < 2) {
                        this.nextGrid[i][j] = state.oncealive;
                        cell.style.background = '#D93919';
                    } else if (numberOfNighbors === 2 || numberOfNighbors === 3) {
                        this.nextGrid[i][j] = state.alive;
                        cell.style.background = '#4fdc1b';
                    } else if (numberOfNighbors > 3) {
                        this.nextGrid[i][j] = state.oncealive;
                        cell.style.background = '#D93919';
                    }
                } else if (this.grid[i][j] === state.oncealive || this.grid[i][j] === state.dead) {
                    if (numberOfNighbors === 3) {
                        this.nextGrid[i][j] = state.alive;
                        cell.style.background = '#4fdc1b';
                    }
                }
            }
        }

        this.generation++;
    }
    public static SetSize() {

        this.clear();

        var height = Number((<HTMLInputElement>document.getElementById('height-textbox-value')).value);
        var width = Number((<HTMLInputElement>document.getElementById('width-textbox-value')).value);

        if (height < 10) {

            this.rows = 10;

        } else {
            this.rows = height;
        }

        if (width < 10) {
            this.columns = 10;
        } else {
            this.columns = width;
        }

        var generation: any = document.getElementById('generation');
        generation.innerHTML = "Generation: " + gameLogic.generation.toString();

        cgolpitch.generateField(document.getElementById('match-grid'), this.rows, this.columns);

        var gridSize: any = document.getElementById("grid-size");
        gridSize.innerHTML  = (this.rows.toString() + "X" + this.columns.toString());
    }

    static SetState(div: any) {

        var index = div.id.toString().split(";");

        if (this.grid[index[0]][index[1]] === state.alive) {
            div.style.backgroundColor = "#dae8e2";
            this.grid[index[0]][index[1]] = state.dead;

        } else if (this.grid[index[0]][index[1]] === state.dead) {
            div.style.background = '#4fdc1b';
            this.grid[index[0]][index[1]] = state.alive;
        }
    }

    static start() {
        this.run();
    }

    static clear() {
        clearTimeout(this.interval);
        var cells = document.getElementsByClassName('cell');

        for (let index = 0; index < cells.length; index++) {
            (<HTMLElement>cells[index]).style.backgroundColor = "#dae8e2";
        }

        for (var i: number = 0; i < this.rows; i++) {
            this.grid[i] = [];
            this.nextGrid[i] = [];
            for (var j: number = 0; j < this.columns; j++) {
                this.grid[i][j] = state.dead;
                this.nextGrid[i][j] = state.dead;
            }
        }

        this.generation = 0;
        var generation: any = document.getElementById('generation');
        generation.innerHTML = "Generation: " + gameLogic.generation.toString();
    }

    static pause() {
        clearTimeout(this.interval);
    }

    static countNeighbors(matchfield: any, row: any, col: any) {
        var neightbors = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var tempCol = (col + i + this.columns) % this.columns;
                var tempRow = (row + j + this.rows) % this.rows;
                if (matchfield[tempRow][tempCol] === state.alive) {
                    neightbors++;
                }
            }
        }
        if (matchfield[row][col] === state.alive) {
            neightbors--;
        }
        return neightbors;
    }
}