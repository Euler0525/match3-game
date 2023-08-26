import * as PIXI from "pixi.js";

import { App } from "../system/App";
import { Field } from "./Field";
import { Tile } from "./Tile"


// 游戏面板
export class Board {
    constructor() {
        this.container = new PIXI.Container();

        this.fields = [];                   // 格子数
        this.rows = App.config.board.rows;  // 行数
        this.cols = App.config.board.cols;  // 列数

        this.create();
        this.ajustPosition();
    }

    create() {
        this.createFields();  // 创建 n*n 的场地
        this.createTiles();   // 创建图块
    }

    createFields() {
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                this.createField(row, col);
            }
        }
    }

    createField(row, col) {
        const field = new Field(row, col);

        this.fields.push(field);
        this.container.addChild(field.sprite);
    }

    createTiles() {
        this.fields.forEach(field => this.createTile(field));
    }

    createTile(field) {
        const random = Math.random();
        let colorIndex;

        if (random < 0.95) {
            colorIndex = this.randomNumber(0, App.config.tilesColors.length - 2);
        } else {
            colorIndex = App.config.tilesColors.length - 1;
        }

        const color = App.config.tilesColors[colorIndex];
        const tile = new Tile(color);

        field.setTile(tile);
        this.container.addChild(tile.sprite);

        tile.sprite.interactive = true;
        tile.sprite.on("pointerdown", () => {
            this.container.emit('tile-touch-start', tile);
        });

        return tile;
    }


    getField(row, col) {
        return this.fields.find(field => field.row === row && field.col === col);
    }

    swap(tile1, tile2) {
        /**
         * 交换两个图块
         */
        const tile1Field = tile1.field;
        const tile2Field = tile2.field;

        tile1Field.tile = tile2;
        tile2.field = tile1Field;

        tile2Field.tile = tile1;
        tile1.field = tile2Field;
    }

    //>>>TODO 面板位置居中
    ajustPosition() {
        this.fieldSize = this.fields[0].sprite.width;
        this.width = this.cols * this.fieldSize;
        this.height = this.rows * this.fieldSize;
        this.container.x = (window.innerWidth - this.width) / 2 + this.fieldSize / 2;
        this.container.y = (window.innerHeight - this.height) / 2 + this.fieldSize / 2;
    }

    randomNumber(min, max) {
        if (!max) {
            max = min;
            min = 0;
        }

        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}
