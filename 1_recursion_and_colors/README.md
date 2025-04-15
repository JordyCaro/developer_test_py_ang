# Recursion and Colors - Tower of Hanoi Variant

This is a solution to the colored Tower of Hanoi problem where disks have both size and color, with additional constraints on disk placement.

## Problem Description

Given n disks of different sizes and colors stacked on a source rod, transfer all disks to a target rod using an auxiliary rod, following these rules:
1. Only one disk can be moved at a time
2. A larger disk cannot be placed on top of a smaller disk
3. Disks of the same color cannot be placed directly on top of each other
4. The solution must use recursion

## Usage

```python
from solution import solve_colored_hanoi

# Example usage
n = 3
disks = [(3, "red"), (2, "blue"), (1, "red")]
result = solve_colored_hanoi(n, disks)

# Result will be either:
# - A list of moves as tuples (disk_number, from_rod, to_rod)
# - -1 if the transfer is impossible
```

## Input Format
- n: An integer (1 ≤ n ≤ 8) representing the number of disks
- disks: A list of n tuples where each tuple contains (size, color), sorted in descending order of size

## Output Format
- A list of moves, where each move is represented as a tuple (disk_number, from_rod, to_rod)
- -1 if the transfer is impossible

## Example

```python
# Input
n = 3
disks = [(3, "red"), (2, "blue"), (1, "red")]

# Output
[
    (1, "A", "C"),
    (2, "A", "B"),
    (1, "C", "B"),
    (3, "A", "C"),
    (1, "B", "A"),
    (2, "B", "C"),
    (1, "A", "C")
]
``` 