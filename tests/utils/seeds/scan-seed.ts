import { ObjectId } from 'mongodb'

export const scanSeeds = [
  {
    _id: new ObjectId('68ae0db703b87ae1f00f6f0a'),
    url: 'https://www.google.com',
    createdAt: new Date('2025-08-26T19:40:39.794Z').toISOString(),
    updatedAt: new Date('2025-08-26T19:40:39.794Z').toISOString(),
    violations: [
      {
        id: 'link-in-text-block',
        impact: 'serious',
        description:
          'Ensure links are distinguished from surrounding text in a way that does not rely on color',
      },
    ],
  },
  {
    _id: new ObjectId('68ae0e1703b87ae1f00f6f0b'),
    url: 'https://www.example.com',
    createdAt: new Date('2025-08-27T10:15:22.123Z').toISOString(),
    updatedAt: new Date('2025-08-27T10:15:22.123Z').toISOString(),
    violations: [
      {
        id: 'color-contrast',
        impact: 'moderate',
        description:
          'Ensure the contrast between foreground and background colors meets WCAG 2 AA contrast ratio thresholds',
      },
    ],
  },
  {
    _id: new ObjectId('68ae0e8a03b87ae1f00f6f0c'),
    url: 'https://www.wikipedia.org',
    createdAt: new Date('2025-08-28T08:30:10.456Z').toISOString(),
    updatedAt: new Date('2025-08-28T08:30:10.456Z').toISOString(),
    violations: [
      {
        id: 'image-alt',
        impact: 'critical',
        description:
          'Ensure all images have alternate text or a role of none or presentation',
      },
      {
        id: 'form-label',
        impact: 'serious',
        description: 'Ensure every form element has a label',
      },
    ],
  },
]
