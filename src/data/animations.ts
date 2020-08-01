// Animations for various art assets

const walk_speed = 200;

// Character animations
export const CharacterAnimations = {
    male: {
        'walking/down': [
            [3 * 16, 0 * 16, walk_speed],
            [5 * 16, 0 * 16, walk_speed],
        ],
        'walking/left': [
            [3 * 16, 1 * 16, walk_speed],
            [5 * 16, 1 * 16, walk_speed],
        ],
        'walking/right': [
            [3 * 16, 2 * 16, walk_speed],
            [5 * 16, 2 * 16, walk_speed],
        ],
        'walking/up': [
            [3 * 16, 3 * 16, walk_speed],
            [5 * 16, 3 * 16, walk_speed],
        ],
        'standing/down': [
            [4 * 16, 0 * 16, 0],
        ],
        'standing/left': [
            [4 * 16, 1 * 16, 0],
        ],
        'standing/right': [
            [4 * 16, 2 * 16, 0],
        ],
        'standing/up': [
            [4 * 16, 3 * 16, 0],
        ],
    },

    female: {
        'walking/down': [
            [6 * 16, 0 * 16, walk_speed],
            [8 * 16, 0 * 16, walk_speed],
        ],
        'walking/left': [
            [6 * 16, 1 * 16, walk_speed],
            [8 * 16, 1 * 16, walk_speed],
        ],
        'walking/right': [
            [6 * 16, 2 * 16, walk_speed],
            [8 * 16, 2 * 16, walk_speed],
        ],
        'walking/up': [
            [6 * 16, 3 * 16, walk_speed],
            [8 * 16, 3 * 16, walk_speed],
        ],
        'standing/down': [
            [7 * 16, 0 * 16, 0],
        ],
        'standing/left': [
            [7 * 16, 1 * 16, 0],
        ],
        'standing/right': [
            [7 * 16, 2 * 16, 0],
        ],
        'standing/up': [
            [7 * 16, 3 * 16, 0],
        ],
    },
};

export type CharacterAnimation = typeof CharacterAnimations.female;