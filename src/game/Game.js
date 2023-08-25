import * as PIXI from "pixi.js";
import { App } from "../system/App";
import { Board } from "./Board";
import { CombinationManager } from "./CombinationManager";

export class Game {
    constructor() {
        this.container = new PIXI.Container();
        this.createBackground();

        this.board = new Board();
        this.container.addChild(this.board.container);

        this.board.container.on('tile-touch-start', this.onTileClick.bind(this));

        this.combinationManager = new CombinationManager(this.board);
        this.removeStartMatches();

        // 增加计分功能
        this.score = 0;
        this.startTime = Date.now();
        this.restartTimeout = null;

        // 增加关卡功能
        this.currentLevel = 1;
        this.levelScores = [];
        this.levelScores.push(0)
        this.maxLevel = 100;
    }

    removeStartMatches() {
        let matches = this.combinationManager.getMatches();

        while (matches.length) {
            this.removeMatches(matches);

            const fields = this.board.fields.filter(field => field.tile === null);

            fields.forEach(field => {
                this.board.createTile(field);
            });

            matches = this.combinationManager.getMatches();
        }
    }

    createBackground() {
        this.bg = App.sprite("bg");
        this.bg.width = window.innerWidth;
        this.bg.height = window.innerHeight;
        this.container.addChild(this.bg);
    }

    onTileClick(tile) {
        if (this.disabled) {
            return;
        }
        if (this.selectedTile) {
            // select new tile or make swap
            if (!this.selectedTile.isNeighbour(tile)) {
                this.clearSelection(tile);
                this.selectTile(tile);
            } else {
                this.swap(this.selectedTile, tile);
            }


        } else {
            this.selectTile(tile);
        }
    }

    swap(selectedTile, tile, reverse) {
        this.disabled = true;
        selectedTile.sprite.zIndex = 2;
        selectedTile.moveTo(tile.field.position, 0.2);

        this.clearSelection();

        tile.moveTo(selectedTile.field.position, 0.2).then(() => {
            this.board.swap(selectedTile, tile);

            if (!reverse) {
                const matches = this.combinationManager.getMatches();
                if (matches.length) {
                    this.processMatches(matches);
                } else {
                    this.swap(tile, selectedTile, true);
                }
            } else {
                this.disabled = false;
            }
        });
    }

    removeMatches(matches) {
        matches.forEach(match => {
            match.forEach(tile => {
                tile.remove();
                this.score += 10;  // 每移除一个加10分
            });
        });
    }

    processMatches(matches) {
        this.removeMatches(matches);
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => {
                this.onFallDownOver();
                this.updateScore();  // 更新分数
            });
    }

    onFallDownOver() {
        const matches = this.combinationManager.getMatches();

        if (matches.length) {
            this.processMatches(matches)
        } else {
            this.disabled = false;
        }
    }

    addTiles() {
        return new Promise(resolve => {
            const fields = this.board.fields.filter(field => field.tile === null);
            let total = fields.length;
            let completed = 0;

            fields.forEach(field => {
                const tile = this.board.createTile(field);
                tile.sprite.y = -500;
                const delay = Math.random() * 2 / 10 + 0.3 / (field.row + 1);
                tile.fallDownTo(field.position, delay).then(() => {
                    ++completed;
                    if (completed >= total) {
                        resolve();
                    }
                });
            });
        });
    }

    processFallDown() {
        return new Promise(resolve => {
            let completed = 0;
            let started = 0;

            for (let row = this.board.rows - 1; row >= 0; row--) {
                for (let col = this.board.cols - 1; col >= 0; col--) {
                    const field = this.board.getField(row, col);

                    if (!field.tile) {
                        ++started;
                        this.fallDownTo(field).then(() => {
                            ++completed;
                            if (completed >= started) {
                                resolve();
                            }
                        });
                    }
                }
            }
        });
    }

    fallDownTo(emptyField) {
        for (let row = emptyField.row - 1; row >= 0; row--) {
            let fallingField = this.board.getField(row, emptyField.col);

            if (fallingField.tile) {
                const fallingTile = fallingField.tile;
                fallingTile.field = emptyField;
                emptyField.tile = fallingTile;
                fallingField.tile = null;
                return fallingTile.fallDownTo(emptyField.position);
            }
        }

        return Promise.resolve();
    }

    clearSelection() {
        if (this.selectedTile) {
            this.selectedTile.field.unselect();
            this.selectedTile = null;
        }
    }

    selectTile(tile) {
        this.selectedTile = tile;
        this.selectedTile.field.select();
    }


    // 关卡处理
    processMatches(matches) {
        this.removeMatches(matches);
        this.processFallDown()
            .then(() => this.addTiles())
            .then(() => {
                this.onFallDownOver();
                this.updateScoreLevel();

                // 检查是否到达下一关
                const levelThreshold = this.currentLevel * 500;
                if (this.score >= levelThreshold - 30 && this.currentLevel < this.maxLevel) {
                    ++this.currentLevel;
                    this.score -= levelThreshold;  // 分数清零
                }
            });
    }


    // 计分处理
    updateScoreLevel() {
        this.displayScore(this.score)
        this.displayLevel(this.currentLevel)
    }

    displayScore(score) {
        const existingScoreDisplay = document.getElementById("scoreDisplay");

        if (existingScoreDisplay) {
            existingScoreDisplay.parentNode.removeChild(existingScoreDisplay);
        }

        const scoreDisplay = document.createElement("div");
        scoreDisplay.id = "scoreDisplay";
        scoreDisplay.textContent = "当前得分: " + score + " ";

        scoreDisplay.style.position = "fixed";
        scoreDisplay.style.bottom = "10px";
        scoreDisplay.style.right = "10px";
        scoreDisplay.style.fontFamily = "Arial";
        scoreDisplay.style.fontSize = "36pt"; // 修改字号为48pt
        document.body.appendChild(scoreDisplay);
    }

    displayLevel(level) {
        const existingLevelDisplay = document.getElementById("levelDisplay");

        if (existingLevelDisplay) {
            existingLevelDisplay.parentNode.removeChild(existingLevelDisplay);
        }

        const levelDisplay = document.createElement("div");
        levelDisplay.id = "levelDisplay";
        levelDisplay.style.position = "fixed";
        levelDisplay.style.top = "10px";
        levelDisplay.style.left = "10px";
        levelDisplay.style.fontFamily = "Arial";
        levelDisplay.style.fontSize = "48pt"; // 修改字号为48pt

        const levelText = document.createElement("div");
        levelText.textContent = "第 " + this.currentLevel + " 关";
        levelDisplay.appendChild(levelText);

        const targetScoreText = document.createElement("div");
        targetScoreText.style.fontSize = "23pt"; // 设置目标分数的字号为24pt
        targetScoreText.textContent = "目标分数：" + this.currentLevel * 500;
        levelDisplay.appendChild(targetScoreText);

        document.body.appendChild(levelDisplay);
    }


}