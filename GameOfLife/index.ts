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
        var generation : any = document.getElementById('generation');
        generation.innerHTML = "Generation: " + gameLogic.generation.toString();
        cgolpitch.generateField(document.getElementById('match-grid'), rows, columns);
    }
    setClickEvents() {
        var startbutton: any = document.getElementById('start-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.start();
        });
        var pausebutton: any = document.getElementById('pause-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.pause();
        });

        var clearbutton: any = document.getElementById('clear-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.clear();
        });
        var setSizeButton: any = document.getElementById('set-size-button')?.addEventListener("click", function () {
            event?.preventDefault();
            gameLogic.SetSize();
        });
    }
    static generateField(grid: any, rows: any, columns: any) {
        console.log('create matchfield');

        for (let i = grid.childNodes.length - 1; i >= 0; i--) {
            grid.removeChild(grid.childNodes[i]);
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

        // for (let i = 0; i < rows; i++) {
        //     array[i] = new Array(columns);
        //     var div = document.createElement('div');
        //     for (let j = 0; j < columns; j++) {
        //         let divcell = document.createElement("div");
        //         divcell.style.padding = '0px';
        //         divcell.className = 'cell';
        //         divcell.id = (Number(i) + ',' + Number(j));
        //         var cellSize = Math.trunc(Math.min((window.innerWidth - 20) / columns, window.innerHeight / rows));
        //         divcell.style.width = cellSize.toString() + 'px';
        //         divcell.style.height = cellSize.toString() + 'px';
        //         divcell.style.background = '#dae8e2';
        //         div.id = j.toString();
        //         array[i][j] = divcell;
        //         array[i][j] = 2;
        //         //array[i][j].setAttribute('class', 'dead');
        //         divcell.onclick = () => gameLogic.SetState(divcell);

        //         div.appendChild(divcell);

        //         div.style.border = "0";
        //         div.style.height = cellSize.toString() + "px";
        //         matchfield.appendChild(div);
        //     }
        // }

        // document.body.appendChild(matchfield);
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
    public static generation : number = 0;
    public() {

    }
    constructor() {
    }
    static run() {

        this.interval = setInterval(() => this.generateNextGeneration(), 500);

    }

    static generateNextGeneration() {
        this.applyRules();
        this.copyAndResetGrid();
        this.updateView();
        var generation : any = document.getElementById('generation');
        generation.innerHTML = "Generation: " + gameLogic.generation.toString();

    }
    static updateView() {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.columns; j++) {
                let idCell = i.toString() + ";" + j.toString();
                var cell: any = document.getElementById(idCell);
                if (this.grid[i][j] == state.dead) {
                    //cell.setAttribute("class", "dead");
                    cell.style.backgroundColor = "#dae8e2";
                } else if (this.grid[i][j] == state.oncealive) {
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
                if (this.grid[i][j] == 2) {
                    lifeState = state.oncealive;
                } else if (this.grid[i][j] == state.dead) {
                    lifeState = state.dead;
                }
                this.grid[i][j] = this.nextGrid[i][j];
                //this.nextGrid[i][j] = state.dead;
            }
        }

    }

    static applyRules() {

        for (var i: number = 0; i < this.rows; i++) {
            for (var j: number = 0; j < this.columns; j++) {
                var numberOfNighbors = this.countNeighbors(this.grid, i, j);
                let idCell = i.toString() + ";" + j.toString();
                var cell: any = document.getElementById(idCell);

                if (this.grid[i][j] == state.alive) {
                    if (numberOfNighbors < 2) {
                        this.nextGrid[i][j] = state.oncealive;
                        cell.style.background = '#D93919';
                    } else if (numberOfNighbors == 2 || numberOfNighbors == 3) {
                        this.nextGrid[i][j] = state.alive;
                        cell.style.background = '#4fdc1b';
                    } else if (numberOfNighbors > 3) {
                        this.nextGrid[i][j] = state.oncealive;
                        cell.style.background = '#D93919';
                    }
                } else if (this.grid[i][j] == state.oncealive || this.grid[i][j] == state.dead) {
                    if (numberOfNighbors == 3) {
                        this.nextGrid[i][j] = state.alive;
                        cell.style.background = '#4fdc1b';
                    }
                }
            }
        }

        this.generation++;
    }
    public static SetSize() {

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
        cgolpitch.generateField(this.grid, this.rows, this.columns);
    }

    static SetState(div: any) {

        var index = div.id.toString().split(";");

        if (this.grid[index[0]][index[1]] == state.alive) {
            div.style.backgroundColor = "#dae8e2";
            this.grid[index[0]][index[1]] = state.dead;

        } else if (this.grid[index[0]][index[1]] == state.dead) {
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
		
		for (let index = 0; index < cells.length; index++)
		{			
			(<HTMLElement>cells[index]).style.backgroundColor = "#dae8e2";	
		}

		// Clear logical array.
		for(var i: number = 0; i < this.rows; i++) {
            this.grid[i] = [];
            this.nextGrid[i] = [];
            for(var j: number = 0; j < this.columns; j++) {
                this.grid[i][j] = state.dead;
                this.nextGrid[i][j] = state.dead;
            }
        }

        this.generation = 0;
        var generation : any = document.getElementById('generation');
        generation.innerHTML = "Generation: " + gameLogic.generation.toString();
    }

    static pause() {
        clearTimeout(this.interval);
    }

    static countNeighbors(matchfield: any, row: any, col: any) {
        var neightbors = 0;
        let sum = 0;
        for (var i = -1; i < 2; i++) {
            for (var j = -1; j < 2; j++) {
                var tempCol = (col + i + this.columns) % this.columns;
                var tempRow = (row + j + this.rows) % this.rows;
                if (matchfield[tempRow][tempCol] == state.alive) {
                    neightbors++;
                }
            }
        }
        if (matchfield[row][col]== state.alive) {
            sum--;
        }
        return neightbors;
    }
}