import { jest } from 'bun:test'

export const source = 'axe-core-mock-source'
export const run = jest.fn().mockResolvedValue({
  violations: [
    {
      id: 'color-contrast',
      impact: 'serious',
      description:
        'Ensures the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
      nodes: [
        {
          html: '<button style="color: #aaa">Click me</button>',
          target: ['button'],
          failureSummary: 'Low contrast',
        },
      ],
    },
  ],
  passes: [],
  incomplete: [],
  inapplicable: [],
})
