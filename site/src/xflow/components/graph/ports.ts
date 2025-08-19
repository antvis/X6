export const ports = {
  groups: {
    group1: {
      position: 'top',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
    group2: {
      position: 'right',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
    group3: {
      position: 'bottom',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
    group4: {
      position: 'left',
      attrs: {
        circle: {
          stroke: '#D06269',
          strokeWidth: 1,
          r: 4,
          magnet: true,
        },
      },
    },
  },
  items: [
    { id: 'group1', group: 'group1' },
    { id: 'group2', group: 'group2' },
    { id: 'group3', group: 'group3' },
    { id: 'group4', group: 'group4' },
  ],
}
