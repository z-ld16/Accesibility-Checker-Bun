import { jest } from 'bun:test'

const newPageMock = {
  goto: jest.fn().mockResolvedValue(undefined),
  addScriptTag: jest.fn().mockResolvedValue(undefined),
  evaluate: jest.fn().mockImplementation(async fn => {
    if (typeof fn === 'function') {
      return {
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
      }
    }
    return null
  }),
}

export const launch = jest.fn().mockResolvedValue({
  newPage: jest.fn().mockResolvedValue(newPageMock),
  close: jest.fn().mockResolvedValue(undefined),
})
