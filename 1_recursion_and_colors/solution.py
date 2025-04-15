def solve_colored_hanoi(n, disks):
    """
    Solves the colored Tower of Hanoi problem with additional color constraints.
    
    Args:
        n (int): Number of disks
        disks (list): List of tuples (size, color) representing disks, sorted in descending order
        
    Returns:
        list: Sequence of moves as tuples (disk_number, from_rod, to_rod) or -1 if impossible
    """
    # Initialize rods (A: source, B: auxiliary, C: target)
    rods = {
        'A': disks.copy(),
        'B': [],
        'C': []
    }
    
    moves = []
    
    def can_move(disk, target_rod):
        """Check if a disk can be moved to the target rod based on size and color rules."""
        if not target_rod:
            return True
        # Check size rule
        if disk[0] > target_rod[-1][0]:
            return False
        # Check color rule
        if disk[1] == target_rod[-1][1]:
            return False
        return True
    
    def move_disks(num_disks, source, target, auxiliary):
        """Recursive function to move disks following the rules."""
        if num_disks == 0:
            return True
            
        # Try to move n-1 disks to auxiliary rod
        if not move_disks(num_disks - 1, source, auxiliary, target):
            return False
            
        # Move the nth disk to target if possible
        current_disk = rods[source][-1]
        if can_move(current_disk, rods[target]):
            disk = rods[source].pop()
            rods[target].append(disk)
            moves.append((disk[0], source, target))
        else:
            # If we can't move the disk, try moving n-1 disks back
            if not move_disks(num_disks - 1, auxiliary, source, target):
                return False
            return False
            
        # Move n-1 disks from auxiliary to target
        return move_disks(num_disks - 1, auxiliary, target, source)
    
    # Try to solve the puzzle
    if move_disks(n, 'A', 'C', 'B'):
        return moves
    else:
        return -1

# Example usage
if __name__ == "__main__":
    # Example 1
    n1 = 3
    disks1 = [(3, "red"), (2, "blue"), (1, "red")]
    print("Example 1:")
    print(solve_colored_hanoi(n1, disks1))
    
    # Example 2
    n2 = 3
    disks2 = [(3, "red"), (2, "blue"), (1, "red")]
    print("\nExample 2:")
    print(solve_colored_hanoi(n2, disks2)) 