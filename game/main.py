import sys
import tkinter as tk
from tkinter import messagebox
from typing import List

BOARD_SIZE = 4


class TicTacToeApp:
    def __init__(self, root: tk.Tk) -> None:
        self.root = root
        self.root.title("Крестики-нолики 4x4")
        self.root.resizable(False, False)

        self.current_player = "X"
        self.game_over = False
        self.board = [["" for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]
        self.buttons: List[List[tk.Button]] = []

        self.status_var = tk.StringVar()
        self.status_label = tk.Label(
            root,
            textvariable=self.status_var,
            font=("Arial", 14),
            pady=10,
        )
        self.status_label.pack()

        board_frame = tk.Frame(root, padx=10, pady=10)
        board_frame.pack()

        for row in range(BOARD_SIZE):
            button_row: List[tk.Button] = []
            for col in range(BOARD_SIZE):
                button = tk.Button(
                    board_frame,
                    text="",
                    width=5,
                    height=2,
                    font=("Arial", 22, "bold"),
                    command=lambda r=row, c=col: self.make_move(r, c),
                )
                button.grid(row=row, column=col, padx=4, pady=4)
                button_row.append(button)
            self.buttons.append(button_row)

        self.restart_button = tk.Button(
            root,
            text="Начать заново",
            font=("Arial", 12),
            command=self.restart_game,
            padx=10,
            pady=5,
        )
        self.restart_button.pack(pady=(0, 10))

        self.update_status()

    def update_status(self) -> None:
        if not self.game_over:
            self.status_var.set(f"Ход игрока: {self.current_player}")

    def set_board_state(self, state: str) -> None:
        for row in self.buttons:
            for button in row:
                button.config(state=state)

    def make_move(self, row: int, col: int) -> None:
        if self.game_over:
            return

        if self.board[row][col] != "":
            self.status_var.set(f"Клетка занята. Ход игрока: {self.current_player}")
            return

        self.board[row][col] = self.current_player
        self.buttons[row][col].config(text=self.current_player)

        if self.check_winner(self.current_player):
            self.finish_game(f"Победил игрок {self.current_player}!")
            return

        if self.is_draw():
            self.finish_game("Ничья!")
            return

        self.current_player = "O" if self.current_player == "X" else "X"
        self.update_status()

    def check_winner(self, player: str) -> bool:
        for i in range(BOARD_SIZE):
            if all(self.board[i][j] == player for j in range(BOARD_SIZE)):
                return True
            if all(self.board[j][i] == player for j in range(BOARD_SIZE)):
                return True

        if all(self.board[i][i] == player for i in range(BOARD_SIZE)):
            return True
        if all(self.board[i][BOARD_SIZE - 1 - i] == player for i in range(BOARD_SIZE)):
            return True

        return False

    def is_draw(self) -> bool:
        return all(cell != "" for row in self.board for cell in row)

    def finish_game(self, message: str) -> None:
        self.game_over = True
        self.status_var.set(message)
        self.set_board_state("disabled")
        messagebox.showinfo("Игра завершена", message)

    def restart_game(self) -> None:
        self.current_player = "X"
        self.game_over = False
        self.board = [["" for _ in range(BOARD_SIZE)] for _ in range(BOARD_SIZE)]

        for row in self.buttons:
            for button in row:
                button.config(text="")

        self.set_board_state("normal")
        self.update_status()


def main() -> None:
    try:
        root = tk.Tk()
    except tk.TclError as error:
        print("Не удалось запустить Tkinter GUI.")
        print("Проверьте, установлен ли Tk и доступен ли графический дисплей.")
        print(f"Подробности: {error}")
        sys.exit(1)

    TicTacToeApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
