export type TrainerCourseContent = {
  id: string;
  title: string;
  type: 'TEXT' | 'VIDEO_URL';
  url?: string;
  body?: string;
  durationMinutes?: number;
};

export type TrainerQuickQuestion = {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  marks: number;
};

export type TrainerCourseAssessment = {
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  questions: TrainerQuickQuestion[];
};

export type TrainerDummyModule = {
  id: string;
  title: string;
  description: string;
  contents: TrainerCourseContent[];
  quickQuiz?: {
    title: string;
    description: string;
    questions: TrainerQuickQuestion[];
  };
};

export type TrainerDummyCourse = {
  courseId: number;
  courseTitle: string;
  description: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  durationHours: number;
  trainees: number;
  completion: number;
  averageScore: number;
  modules: TrainerDummyModule[];
  finalAssessment: TrainerCourseAssessment;
};

export const TRAINER_DASHBOARD_DEMO_COURSES_ENABLED = true;

export const trainerDummyCourses: TrainerDummyCourse[] = [
  {
    courseId: 901,
    courseTitle: 'Meteorological Observation & Instruments',
    description:
      'Fundamentals of surface weather observation, meteorological instruments and observation practices.',
    category: 'Meteorological Observation',
    level: 'BEGINNER',
    durationHours: 8,
    trainees: 28,
    completion: 78,
    averageScore: 84,
    modules: [
      {
        id: '901-m1',
        title: 'Module 1 · Fundamentals of Observation',
        description:
          'Introduction to weather parameters and standard observation practices.',
        contents: [
          {
            id: '901-m1-text-1',
            title: 'Basics of Weather Observation',
            type: 'TEXT',
            body:
              'Introduction to atmospheric observations, weather parameters and standard observation practices.',
            durationMinutes: 15,
          },
          {
            id: '901-m1-video-1',
            title: 'Weather Observation Demonstration',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=IMD+meteorological+observation',
            durationMinutes: 12,
          },
        ],
      },
      {
        id: '901-m2',
        title: 'Module 2 · Meteorological Instruments',
        description:
          'Understand instruments used for temperature, pressure, humidity, wind and rainfall.',
        contents: [
          {
            id: '901-m2-text-1',
            title: 'Meteorological Instruments',
            type: 'TEXT',
            body:
              'Overview of instruments used to measure temperature, pressure, humidity, wind and precipitation.',
            durationMinutes: 20,
          },
          {
            id: '901-m2-video-1',
            title: 'Meteorological Instruments Overview',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=meteorological+instruments+IMD',
            durationMinutes: 14,
          },
        ],
        quickQuiz: {
          title: 'Quick Check · Meteorological Instruments',
          description: 'A short knowledge check before completing Module 2.',
          questions: [
            {
              id: '901-q1',
              question: 'Which parameter is measured using a barometer?',
              options: ['Wind speed', 'Atmospheric pressure', 'Rainfall', 'Humidity'],
              correctOption: 1,
              marks: 1,
            },
            {
              id: '901-q2',
              question: 'Which observation is directly related to precipitation?',
              options: ['Rainfall', 'Air pressure', 'Wind direction', 'Visibility'],
              correctOption: 0,
              marks: 1,
            },
            {
              id: '901-q3',
              question: 'Anemometers are primarily used to measure:',
              options: ['Temperature', 'Wind speed', 'Pressure', 'Humidity'],
              correctOption: 1,
              marks: 1,
            },
          ],
        },
      },
    ],
    finalAssessment: {
      title: 'Course Assessment · Meteorological Observation & Instruments',
      description:
        'Final assessment covering the key concepts and instruments introduced in this course.',
      durationMinutes: 20,
      totalMarks: 10,
      questions: [
        {
          id: '901-f1',
          question: 'Which instrument is used to measure atmospheric pressure?',
          options: ['Barometer', 'Rain gauge', 'Anemometer', 'Thermometer'],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '901-f2',
          question: 'Which instrument measures wind speed?',
          options: ['Hygrometer', 'Anemometer', 'Barometer', 'Thermometer'],
          correctOption: 1,
          marks: 2,
        },
        {
          id: '901-f3',
          question: 'What is the purpose of a rain gauge?',
          options: [
            'Measure rainfall',
            'Measure temperature',
            'Measure pressure',
            'Measure wind direction',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '901-f4',
          question: 'Which parameter describes the amount of water vapour in air?',
          options: ['Pressure', 'Humidity', 'Wind speed', 'Visibility'],
          correctOption: 1,
          marks: 2,
        },
        {
          id: '901-f5',
          question: 'Why are standardized observations important?',
          options: [
            'For consistent weather monitoring',
            'Only for equipment maintenance',
            'Only for rainfall measurement',
            'Only for forecasting alerts',
          ],
          correctOption: 0,
          marks: 2,
        },
      ],
    },
  },

  {
    courseId: 902,
    courseTitle: 'Weather Forecasting Fundamentals',
    description:
      'Core concepts of weather forecasting, atmospheric systems, observations and forecast interpretation.',
    category: 'Weather Forecasting',
    level: 'INTERMEDIATE',
    durationHours: 10,
    trainees: 19,
    completion: 62,
    averageScore: 76,
    modules: [
      {
        id: '902-m1',
        title: 'Module 1 · Forecasting Foundations',
        description:
          'Understand the basic workflow and atmospheric information used in forecasting.',
        contents: [
          {
            id: '902-m1-text-1',
            title: 'Fundamentals of Weather Forecasting',
            type: 'TEXT',
            body:
              'Understanding atmospheric conditions, synoptic systems and the basic forecasting workflow.',
            durationMinutes: 18,
          },
          {
            id: '902-m1-video-1',
            title: 'Introduction to Weather Forecasting',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=IMD+weather+forecasting',
            durationMinutes: 16,
          },
        ],
      },
      {
        id: '902-m2',
        title: 'Module 2 · Weather Systems & Forecast Products',
        description:
          'Explore weather systems, charts and interpretation of forecast products.',
        contents: [
          {
            id: '902-m2-text-1',
            title: 'Forecast Products & Interpretation',
            type: 'TEXT',
            body:
              'Introduction to forecast products, weather charts and interpretation of observational information.',
            durationMinutes: 22,
          },
          {
            id: '902-m2-video-1',
            title: 'Understanding Weather Systems',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=IMD+weather+systems',
            durationMinutes: 18,
          },
        ],
        quickQuiz: {
          title: 'Quick Check · Forecasting Fundamentals',
          description: 'Test your understanding of core forecasting concepts.',
          questions: [
            {
              id: '902-q1',
              question: 'Weather forecasting primarily attempts to predict:',
              options: [
                'Future atmospheric conditions',
                'Past climate records',
                'Only rainfall totals',
                'Only wind direction',
              ],
              correctOption: 0,
              marks: 1,
            },
            {
              id: '902-q2',
              question: 'A weather chart is useful for:',
              options: [
                'Atmospheric analysis',
                'Equipment repair',
                'User authentication',
                'Course enrollment',
              ],
              correctOption: 0,
              marks: 1,
            },
            {
              id: '902-q3',
              question: 'Forecast interpretation should consider:',
              options: [
                'Available observations and forecast guidance',
                'Only temperature',
                'Only humidity',
                'Only historical averages',
              ],
              correctOption: 0,
              marks: 1,
            },
          ],
        },
      },
    ],
    finalAssessment: {
      title: 'Course Assessment · Weather Forecasting Fundamentals',
      description:
        'Final assessment covering forecasting concepts, weather systems and forecast interpretation.',
      durationMinutes: 25,
      totalMarks: 10,
      questions: [
        {
          id: '902-f1',
          question: 'The primary objective of weather forecasting is to:',
          options: [
            'Predict future atmospheric conditions',
            'Measure historical climate only',
            'Record only rainfall',
            'Maintain instruments',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '902-f2',
          question: 'Weather observations provide:',
          options: [
            'Current atmospheric information',
            'Only historical information',
            'Only soil information',
            'Only ocean information',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '902-f3',
          question: 'Forecast charts help meteorologists:',
          options: [
            'Analyze atmospheric systems',
            'Create user accounts',
            'Store certificates',
            'Manage course payments',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '902-f4',
          question: 'Forecast interpretation should combine observations with:',
          options: [
            'Forecast guidance',
            'Only previous-day temperature',
            'Only rainfall',
            'Only humidity',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '902-f5',
          question: 'A synoptic-scale system refers to:',
          options: [
            'A large-scale atmospheric weather system',
            'A single weather instrument',
            'A classroom assessment',
            'A database record',
          ],
          correctOption: 0,
          marks: 2,
        },
      ],
    },
  },

  {
    courseId: 903,
    courseTitle: 'Satellite Meteorology & Remote Sensing',
    description:
      'Introduction to satellite observations, remote sensing products and applications in meteorology.',
    category: 'Satellite Meteorology',
    level: 'INTERMEDIATE',
    durationHours: 9,
    trainees: 34,
    completion: 91,
    averageScore: 88,
    modules: [
      {
        id: '903-m1',
        title: 'Module 1 · Satellite Meteorology Basics',
        description:
          'Understand satellite-based observation and its role in weather monitoring.',
        contents: [
          {
            id: '903-m1-text-1',
            title: 'Satellite Meteorology Basics',
            type: 'TEXT',
            body:
              'Principles of satellite-based observation and the role of satellites in weather monitoring.',
            durationMinutes: 20,
          },
          {
            id: '903-m1-video-1',
            title: 'Satellite Weather Monitoring',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=IMD+satellite+meteorology',
            durationMinutes: 15,
          },
        ],
      },
      {
        id: '903-m2',
        title: 'Module 2 · Remote Sensing Applications',
        description:
          'Use remote sensing imagery for cloud, storm and atmospheric analysis.',
        contents: [
          {
            id: '903-m2-text-1',
            title: 'Remote Sensing for Weather Analysis',
            type: 'TEXT',
            body:
              'Overview of remote sensing imagery and its use in cloud, storm and atmospheric analysis.',
            durationMinutes: 24,
          },
          {
            id: '903-m2-video-1',
            title: 'Remote Sensing in Meteorology',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=remote+sensing+meteorology+IMD',
            durationMinutes: 17,
          },
        ],
        quickQuiz: {
          title: 'Quick Check · Remote Sensing',
          description: 'Quick knowledge check on satellite and remote sensing concepts.',
          questions: [
            {
              id: '903-q1',
              question: 'Satellite imagery is useful for monitoring:',
              options: [
                'Cloud systems',
                'User accounts',
                'Course fees',
                'Database schemas',
              ],
              correctOption: 0,
              marks: 1,
            },
            {
              id: '903-q2',
              question: 'Remote sensing allows atmospheric information to be:',
              options: [
                'Observed remotely',
                'Deleted automatically',
                'Stored only on paper',
                'Used only for attendance',
              ],
              correctOption: 0,
              marks: 1,
            },
            {
              id: '903-q3',
              question: 'Satellite observations can support:',
              options: [
                'Weather monitoring and analysis',
                'Only instrument repair',
                'Only course creation',
                'Only certificate printing',
              ],
              correctOption: 0,
              marks: 1,
            },
          ],
        },
      },
    ],
    finalAssessment: {
      title: 'Course Assessment · Satellite Meteorology & Remote Sensing',
      description:
        'Final assessment covering satellite observation and remote sensing applications.',
      durationMinutes: 25,
      totalMarks: 10,
      questions: [
        {
          id: '903-f1',
          question: 'Satellite meteorology is primarily used for:',
          options: [
            'Atmospheric and weather monitoring',
            'Only administrative work',
            'Only classroom attendance',
            'Only document storage',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '903-f2',
          question: 'Satellite imagery can help identify:',
          options: [
            'Cloud patterns',
            'User passwords',
            'Course invoices',
            'Database keys',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '903-f3',
          question: 'Remote sensing refers to obtaining information:',
          options: [
            'Without direct physical contact with the target',
            'Only through paper forms',
            'Only from ground instruments',
            'Only through interviews',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '903-f4',
          question: 'Satellite observations can complement:',
          options: [
            'Ground-based observations',
            'Only user profiles',
            'Only certificates',
            'Only questionnaires',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '903-f5',
          question: 'Remote sensing products are valuable for:',
          options: [
            'Weather analysis',
            'Only finance',
            'Only authentication',
            'Only course registration',
          ],
          correctOption: 0,
          marks: 2,
        },
      ],
    },
  },

  {
    courseId: 904,
    courseTitle: 'Monsoon & Extreme Weather Analysis',
    description:
      'Study of Indian monsoon behaviour, severe weather systems and extreme weather analysis.',
    category: 'Monsoon & Extreme Weather',
    level: 'ADVANCED',
    durationHours: 12,
    trainees: 12,
    completion: 46,
    averageScore: 71,
    modules: [
      {
        id: '904-m1',
        title: 'Module 1 · Indian Monsoon Fundamentals',
        description:
          'Understand monsoon systems, seasonal behaviour and rainfall patterns.',
        contents: [
          {
            id: '904-m1-text-1',
            title: 'Indian Monsoon Fundamentals',
            type: 'TEXT',
            body:
              'Overview of monsoon systems, seasonal behaviour and major atmospheric factors influencing rainfall.',
            durationMinutes: 22,
          },
          {
            id: '904-m1-video-1',
            title: 'Indian Monsoon Overview',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=IMD+Indian+monsoon',
            durationMinutes: 18,
          },
        ],
      },
      {
        id: '904-m2',
        title: 'Module 2 · Extreme Weather Analysis',
        description:
          'Analyze heavy rainfall, thunderstorms, cyclones and severe weather events.',
        contents: [
          {
            id: '904-m2-text-1',
            title: 'Extreme Weather Analysis',
            type: 'TEXT',
            body:
              'Introduction to analysis of heavy rainfall, thunderstorms, cyclones and other severe weather events.',
            durationMinutes: 25,
          },
          {
            id: '904-m2-video-1',
            title: 'Extreme Weather Monitoring',
            type: 'VIDEO_URL',
            url: 'https://www.youtube.com/results?search_query=IMD+extreme+weather',
            durationMinutes: 20,
          },
        ],
        quickQuiz: {
          title: 'Quick Check · Extreme Weather',
          description: 'Quick check before finishing the extreme weather module.',
          questions: [
            {
              id: '904-q1',
              question: 'Which event is considered severe weather?',
              options: [
                'Thunderstorm',
                'Course enrollment',
                'Certificate issue',
                'User login',
              ],
              correctOption: 0,
              marks: 1,
            },
            {
              id: '904-q2',
              question: 'Heavy rainfall analysis is important for:',
              options: [
                'Understanding rainfall extremes',
                'Managing passwords',
                'Editing profiles',
                'Publishing certificates',
              ],
              correctOption: 0,
              marks: 1,
            },
            {
              id: '904-q3',
              question: 'Cyclones are associated with:',
              options: [
                'Severe weather conditions',
                'Only clear skies',
                'Only low humidity',
                'Only classroom activity',
              ],
              correctOption: 0,
              marks: 1,
            },
          ],
        },
      },
    ],
    finalAssessment: {
      title: 'Course Assessment · Monsoon & Extreme Weather Analysis',
      description:
        'Final assessment covering Indian monsoon and extreme weather analysis.',
      durationMinutes: 30,
      totalMarks: 10,
      questions: [
        {
          id: '904-f1',
          question: 'The Indian monsoon is strongly associated with:',
          options: [
            'Seasonal rainfall patterns',
            'Only snowfall',
            'Only ocean tides',
            'Only air pollution',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '904-f2',
          question: 'Heavy rainfall is an example of:',
          options: [
            'An extreme weather event',
            'A course activity',
            'A user role',
            'A database operation',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '904-f3',
          question: 'Thunderstorms are associated with:',
          options: [
            'Convective weather activity',
            'Only clear weather',
            'Only winter fog',
            'Only sea level pressure records',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '904-f4',
          question: 'Cyclone analysis is important because cyclones can produce:',
          options: [
            'Strong winds and heavy rainfall',
            'Only clear skies',
            'Only low temperatures',
            'Only visibility improvement',
          ],
          correctOption: 0,
          marks: 2,
        },
        {
          id: '904-f5',
          question: 'Monsoon analysis helps understand:',
          options: [
            'Seasonal rainfall behaviour',
            'Only user attendance',
            'Only certificate status',
            'Only course metadata',
          ],
          correctOption: 0,
          marks: 2,
        },
      ],
    },
  },
];
