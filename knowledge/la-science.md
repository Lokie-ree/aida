# Louisiana K-12 Science Standards RAG Context Guide
## Comprehensive Reference for AI-Powered Science Educator Support

---

## Executive Summary

This document serves as the authoritative RAG (Retrieval-Augmented Generation) context for an educator support platform designed to assist Louisiana teachers in planning, creating, and aligning K-12 science instruction. The platform's four Co-Pilot features—Weekly Spark, Alignment Scorecard, Delta Generator, and Innovation Remix Engine—leverage this localized, pedagogically-grounded context to provide proactive, standards-aligned support that competitors cannot replicate.

**Platform Differentiator**: This RAG context transforms generic AI tools into hyper-local, Louisiana-specific educational partners by embedding state standards, vertical progressions, and pedagogical frameworks directly into every platform interaction for science education.

---

## 1. Introduction to Louisiana K-12 Science Standards

### 1.1 Development of K-12 Louisiana Student Standards for Science

The Louisiana Student Standards for Science were created by over eighty content experts and educators with input from parents and teachers from across the state. Educators envisioned what students should know and be able to do to compete in our communities and created standards that would allow students to do so. The Louisiana Student Standards for Science provide appropriate content for all grades or courses, maintain high expectations and create a logical connection of content across and within grades.

The Louisiana Student Standards for Science represent the knowledge and skills needed for students to successfully transition to postsecondary educations and the workplace. The standards call for students to:

*   Apply content knowledge
*   Investigate, evaluate, and reason scientifically
*   Connect ideas across disciplines

The Louisiana Student Standards do not dictate curriculum or teaching methods. Decisions about how to teach these expectations are left to local districts, schools, and teachers.

### 1.2 Structure and Components of the Standards

The Louisiana Student Standards for Science are arranged by grade levels for kindergarten through grade 8 and content areas for high school. The standards include:

*   **Performance expectations** define what students should be able to do by the end of the year.
*   **Science and engineering practices** are the practices that scientists and engineers use when investigating real world phenomena and designing solutions to problems. There are eight science and engineering practices that apply to all grade levels and content areas.

    1. Asking questions (science) and defining problems (engineering)
    2. Developing and using models
    3. Planning and carrying out investigations
    4. Analyzing and interpreting data
    5. Using mathematical and computational thinking
    6. Constructing explanations (science) and designing solutions (engineering)
    7. Engaging in argument with evidence
    8. Obtaining, evaluating, and communicating information
*   **Disciplinary Core Ideas** describe the most essential ideas (content) in the major science disciplines that students will learn. Disciplinary Core Ideas are grouped into five science domains.

    1. Physical Science (PS)
    2. Life Science (LS)
    3. Earth and Space Science (ESS)
    4. Environmental Science (EVS)
    5. Engineering, Technology, and Applications of Science (ETS)
*   **Crosscutting Concepts** are common themes that have application across all disciplines of science and allow students to connect learning within and across grade levels or content areas. The seven crosscutting concepts apply to all grade levels and content areas.

    1. Patterns
    2. Cause and effect
    3. Scale, proportion, and quantity
    4. Systems and System Models
    5. Energy and matter
    6. Structure and function
    7. Stability and change
*   **Clarification statements** provide examples or additional explanation to the performance expectation.

---




## 2. Standards Architecture & Coding System

### 2.1 Understanding Louisiana Science Standard Codes

Each performance expectation is identified by a code and descriptor. The coding is derived by the following formula: Grade level- Domain and Topic Number- Performance Expectation Number (space)

<table>
  <tr>
    <td>3-PS2-1Motion and Stability:Forces and Interactions</td>
    <td>The grade level is 3, the domain is Physical Science, the topic number is 2, and the performance expectation number is 1. The descriptor is, “Motion and Stability: Forces and Interactions.”</td>
  </tr>
  <tr>
    <td>7-MS-ESS2-4Earth’s Systems</td>
    <td>The grade level is 7, the standard is middle school, the domain is Earth and Space Science, the topic number is 2, and the performance expectation is 4. The descriptor is, “Earth’s Systems.”</td>
  </tr>
  <tr>
    <td>HS-LS1-1From Molecules to Organisms:Structures and Processes</td>
    <td>The standard is high school, the domain is Life Science, the topic number is 1, and the performance expectation number is 1. The descriptor is, “From Molecules to Organisms: Structures and Processes.”</td>
  </tr>
</table>

<mermaid>
graph TD
    A[Descriptor] --> B[Louisiana STUDENT STANDARDS SCIENCE]
    B --> C[MATTER AND ITS INTERACTIONS]
    C --> D[Performance Expectation]
    C --> E[Clarification Statement]
    C --> F[Science & Engineering Practices]
    C --> G[Disciplinary Core Ideas]
    C --> H[Crosscutting Concepts]

    D --> I[8 - MS - PS1-1]
    E --> I
    F --> I
    G --> I
    H --> I

    subgraph " "
        direction LR
        J[Grade Level]
        K[Middle School]
        L[Domain]
        M[Performance Expectation]
        N[Topic Number]
        O[8]
    end

    I -- "Grade Level" --> J
    I -- "Middle School" --> K
    I -- "Domain" --> L
    I -- "Performance Expectation" --> M
    I -- "Topic Number" --> N
    I -- "8" --> O
</mermaid>



---




## 3. K-12 Science Performance Expectations

The following sections contain all performance expectations organized by grade level and domain. Each performance expectation includes:

- **Performance Expectation**: What students should be able to do by the end of the year
- **Clarification Statement**: Examples or additional explanation
- **Science & Engineering Practices**: The practices used in this standard
- **Disciplinary Core Ideas**: The essential content ideas
- **Crosscutting Concepts**: Common themes that connect learning

### 3.1 Kindergarten Standards

#### K-PS2-1

# MOTION AND STABILITY: FORCES AND INTERACTIONS

## Performance Expectation
Plan and conduct an investigation to compare the effects of different strengths or different directions of pushes and pulls on the motion of an object.

## Clarification Statement
Examples of pushes or pulls could include a string attached to an object being pulled, a person pushing an object, a person stopping a rolling ball, or two objects colliding and pushing on each other. Content includes contact forces with different relative strengths or different directions, but not both at the same time.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        **3. Planning and carrying out investigations:** Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in K-2 builds on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions.        • With guidance, plan and conduct an investigation in collaboration with peers.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **FORCES AND MOTION**        Pushes and pulls can have different strengths and directions. (LE.PS2A.a)        Pushing or pulling on an object can change the speed or direction of its motion and can start or stop it. (LE.PS2A.b)        **TYPES OF INTERACTIONS**        When objects touch or collide, they push on one another and can change motion. (LE.PS2B.a)        **RELATIONSHIP BETWEEN ENERGY AND FORCES**        A bigger push or pull makes things speed up or slow down more quickly. (LE.PS3C.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Simple tests can be designed to gather evidence to support or refute student ideas about causes.
      </td>
    </tr>
  </tbody>
</table>

---




K-PS2-2

# MOTION AND STABILITY: FORCES AND INTERACTIONS

## Performance Expectation
Analyze data to determine if a design solution works as intended to change the speed or direction of an object with a push or a pull.

## Clarification Statement
Examples of problems requiring a solution could include having a marble or other object move a certain distance, follow a particular path, or knock down other objects. Examples of solutions could include tools such as a ramp to increase the speed of the object, a structure that would cause an object such as a marble or ball to turn or using a rope or string to pull an object. Content does not include friction as a mechanism for change in speed.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        **4. Analyzing and interpreting data:** Analyzing data in K-2 builds on prior experiences and progresses to collecting, recording, and sharing observations.        • Analyze data from tests of an object or tool to determine if it works as intended.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **FORCES AND MOTION**        Pushes and pulls can have different strengths and directions. (LE.PS2A.a)        Pushing or pulling on an object can change the speed or direction of its motion and can start or stop it. (LE.PS2A.b)        **ENGINEERING DESIGN**        A situation that people want to change or create can be approached as a problem to be solved through engineering. Such problems may have many acceptable solutions. (LE.ETS1A.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Simple tests can be designed to gather evidence to support or refute student ideas about causes.
      </td>
    </tr>
  </tbody>
</table>

---




K-PS3-1

# ENERGY

## Performance Expectation
Make observations to determine the effect of sunlight on Earth’s surface.

## Clarification Statement
Sunlight heats Earth’s natural surfaces including sand, soil, rocks, or water and the unnatural surfaces including man-made objects like plastics, asphalt, or concrete. Examples of observations could be relative changes in temperature of surfaces exposed to sunlight.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models
3. **Planning and carrying out investigations:** Planning and carrying out investigations to answer questions or test solutions to problems in K-2 builds on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions.
   * Make observations (firsthand or from media) and/or measurements of a proposed object or tool or solution to determine if it solves a problem or meets a goal.
4. Analyzing and interpreting data
5. Using mathematics and computational thinking
6. Constructing explanations and designing solutions
7. Engaging in argument from evidence
8. Obtaining, evaluating, and communicating information

## Disciplinary Core Ideas
**CONSERVATION OF ENERGY AND ENERGY TRANSFER**
Sunlight warms Earth’s surface. (LE.PS3B.a)

## Crosscutting Concepts
**CAUSE AND EFFECT**
Events have causes that generate observable patterns.

---




K-PS3-2

# ENERGY

## Performance Expectation
Use tools and materials to design and build a structure that will reduce the warming effect of sunlight on an area.

## Clarification Statement
Examples of structures could include umbrellas, canopies, or tents that minimize the warming effect of the sun.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        **6. Constructing explanations and designing solutions:**        Constructing explanations (science) and designing solutions (engineering) in K–2 builds on prior experiences and progresses to the use of evidence and ideas in constructing evidence-based accounts of natural phenomena and designing solutions.        • Use tools and/or materials to design and/or build a device that solves a specific problem or a solution to a specific problem.        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **CONSERVATION OF ENERGY AND ENERGY TRANSFER**        Sunlight warms Earth’s surface. (LE.PS3B.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Simple tests can be designed to gather evidence to support or refute student ideas about causes.
      </td>
    </tr>
  </tbody>
</table>

---




K-LS-1-1

# FROM MOLECULES TO ORGANISMS: STRUCTURES AND PROCESSES

## Performance Expectation
Use observations to describe patterns of what plants and animals (including humans) need to survive.

## Clarification Statement
Examples of patterns could include that plants make their own food while animals do not, the different kinds of food needed by different types of animals, the requirement of plants to have light, or that all living things need water.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out Investigations        **4. Analyzing and interpreting data:** Analyzing data in K-2 builds on prior experiences and progresses to collecting, recording, and sharing observations.        • Use observations to describe patterns and/or relationships in the natural and designed world(s) in order to answer scientific questions and solve problems.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **ORGANIZATION FOR MATTER AND ENERGY FLOW IN ORGANISMS**        All animals need food in order to live and grow. Animals obtain their food from plants or from other animals.        Plants need water and light to live and grow. (LE.LS1C.a)
      </td>
      <td>
        **PATTERNS**        Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.
      </td>
    </tr>
  </tbody>
</table>

---




K-ESS2-1

# EARTH'S SYSTEMS

## Performance Expectation
Use and share observations of local weather conditions to describe patterns over time.

## Clarification Statement
Examples of qualitative observations could include descriptions of the weather (such as sunny, cloudy, rainy, or warm); examples of quantitative observations could include numbers of sunny, windy, or rainy days in a month. Examples of patterns could include that it is cooler in the morning than in the afternoon or the number of sunny days versus cloudy days in different months.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        **4. Analyzing and interpreting data:** Analyzing data in K-2 builds on prior experiences and progresses to collecting, recording, and sharing observations.        • Use observations to describe patterns and/or relationships in the natural and designed world(s) in order to answer scientific questions and solve problems.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **WEATHER AND CLIMATE**        Weather is the combination of sunlight, wind, snow or rain, and temperature in a particular region at a particular time. People measure these conditions to describe and record the weather and to notice patterns over time. (LE.ESS2D.a)
      </td>
      <td>
        **PATTERNS**        Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.
      </td>
    </tr>
  </tbody>
</table>

---




K-ESS2-2

# EARTH'S SYSTEMS

## Performance Expectation
Construct an argument supported by evidence for how plants and animals (including humans) can change the environment to meet their needs.

## Clarification Statement
Examples of plants and animals changing their environment could include a squirrel digging in the ground to hide its food, tree roots breaking concrete, or a dandelion spreading seeds to generate more dandelions.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models
3. Planning and carrying out investigations
4. Analyzing and interpreting data
5. Using mathematics and computational thinking
6. Constructing explanations and designing solutions

**7. Engaging in argument from evidence:** Engaging in argument from evidence in K–2 builds on prior experiences and progresses to comparing ideas and representations about the natural and designed world(s).

* Construct an argument with evidence to support a claim.

8. Obtaining, evaluating, and communicating information

## Disciplinary Core Ideas

**BIOGEOLOGY**
Plants and animals can change their environment. (LE.ESS2E.a)

**HUMAN IMPACTS ON EARTH SYSTEMS**
Things that people do to live comfortably can affect the world around them; but they can make choices that reduce their impacts on the land, water, air, and other living things. (LE.ESS3C.a)

## Crosscutting Concepts

**SYSTEMS AND SYSTEM MODELS**
Systems in the natural and designed world have parts that work together.

---

---




K-ESS3-1

# EARTH AND HUMAN ACTIVITY

## Performance Expectation
Use a model to represent the relationship between the needs of different plants or animals (including humans) and the places they live.

## Clarification Statement
Examples of relationships could include that deer eat buds and leaves and therefore usually live in forested areas; grasses need sunlight so they often grow in meadows. Plants, animals, and their surroundings make up a system.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models: Modeling in K-2 builds on prior experiences and progresses to include using and developing models (e.g., diagram, drawing, physical replica, diorama, dramatization, or storyboard) that represent concrete events or design solutions.
   * Develop and/or use a model to represent amounts, relationships, relative scales (bigger, smaller), and/or patterns in the natural and designed world(s).
3. Planning and carrying out investigations
4. Analyzing and interpreting data
5. Using mathematics and computational thinking
6. Constructing explanations and designing solutions
7. Engaging in argument from evidence
8. Obtaining, evaluating, and communicating information

## Disciplinary Core Ideas
**NATURAL RESOURCES**
Living things need water, air, and resources from the land, and they live in places that have the things they need. Humans use natural resources for everything they do. (LE.ESS3A.a)

## Crosscutting Concepts
**SYSTEMS AND SYSTEM MODELS**
Systems in the natural and designed world have parts that work together.

---
---




K-ESS3-2

# EARTH AND HUMAN ACTIVITY

## Performance Expectation
Ask questions to obtain information about the purpose of weather forecasting to prepare for and respond to severe weather.

## Clarification Statement
Emphasis is on local forms of severe weather and safety precautions associated with that severe weather.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. **Asking questions and defining problems:** Asking questions (science) and defining problems (engineering) in K-2 builds on prior experiences and progresses to simple descriptive questions that can be tested.        • Ask questions based on observations to find more information about the natural and/or designed world(s).
      </td>
      <td>
        **NATURAL HAZARDS**        Some kinds of severe weather are more likely than others in a given region. Weather scientists forecast severe weather so that the communities can prepare for and respond to these events. (LE.ESS3B.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Events have causes that generate observable patterns.
      </td>
    </tr>
    <tr>
      <td>
        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td></td>
      <td></td>
    </tr>
  </tbody>
</table>

---




K-ESS3-3

# EARTH AND HUMAN ACTIVITY

## Performance Expectation
Communicate solutions that will reduce the impact of humans on the land, water, air, and/or other living things in the local environment.

## Clarification Statement
Examples of human impact on the land could include cutting trees to produce paper and using resources to produce bottles. Examples of solutions could include reusing paper and recycling cans and bottles.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. **Obtaining, evaluating, and communicating information:** Obtaining, evaluating, and communicating information in K–2 builds on prior experiences and uses observations and texts to communicate new information.        • Communicate information or design ideas and/or solutions with others in oral and/or written forms using models, drawings, writing, or numbers that provide detail about scientific ideas, practices, and/or design ideas.
      </td>
      <td>
        **HUMAN IMPACTS ON EARTH SYSTEMS**        Things that people do to live comfortably can affect the world around them. But they can make choices that reduce their impacts on the land, water, air, and other living things. (LE.ESS3C.a)        **DEVELOPING POSSIBLE SOLUTIONS**        Designs can be conveyed through sketches, drawings, or physical models. These representations are useful in communicating ideas for a problem’s solution(s) to other people. (LE.ETS1B.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Events have causes that generate observable patterns.
      </td>
    </tr>
  </tbody>
</table>

---




1-PS4-1

# WAVES AND THEIR APPLICATIONS

| Performance Expectation | Plan and conduct investigations to provide evidence that vibrating materials can make sound and that sound can make materials vibrate. |
|---|---|
| Clarification Statement | Examples of vibrating materials that make sound could include tuning forks or plucking a stretched string. Examples of how sound can make matter vibrate could include holding a piece of paper near a speaker making sound or holding an object near a vibrating tuning fork. |

| Science & Engineering Practices | Disciplinary Core Ideas | Crosscutting Concepts |
|---|---|---|
| 1. Asking questions and defining problems | WAVE PROPERTIES | CAUSE AND EFFECT |
| 2. Developing and using models | Sound can make matter vibrate, and vibrating matter can make sound. (LE.PS4A.a) | Simple tests can be designed to gather evidence to support or refute student ideas about causes. |
| **3. Planning and carrying out investigations:** Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in K-2 build on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions. |  |  |
| • Plan and conduct investigations collaboratively to produce data to serve as the basis for evidence to answer a question. |  |  |
| 4. Analyzing and interpreting data |  |  |
| 5. Using mathematics and computational thinking |  |  |
| 6. Constructing explanations and designing solutions |  |  |
| 7. Engaging in argument from evidence |  |  |
| 8. Obtaining, evaluating, and communicating information |  |  |

---
---




1-PS4-2
# WAVES AND THEIR APPLICATIONS

## Performance Expectation
Make observations to construct an evidence-based account that objects can be seen only when illuminated.

## Clarification Statement
Examples of observations could include those made in a completely dark room, a pinhole box, or a video of a cave explorer with a flashlight. Illumination could be from an external light source or by an object giving off its own light. This can be explored with light tables, 3-way mirrors, overhead projectors or flashlights.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        **6. Constructing explanations and designing solutions:**        Constructing explanations (science) and designing solutions (engineering) in K-2 builds on prior experiences and progresses to the use of evidence and ideas in constructing evidence-based accounts of natural phenomena and designing solutions.        • Make observations (firsthand or from media) to construct an evidence-based account for natural phenomena.        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **ELECTROMAGNETIC RADIATION**        Objects can be seen if light is available to illuminate them or if they give off their own light. Some objects give off their own light. (LE.PS4B.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Events have causes that generate observable patterns.
      </td>
    </tr>
  </tbody>
</table>

---




1-PS4-3

# WAVES AND THEIR APPLICATIONS

## Performance Expectation
Plan and conduct an investigation to determine the effect of placing objects made with different materials in the path of a beam of light.

## Clarification Statement
Examples of materials could include those that are transparent (such as clear plastic), translucent (such as wax paper), opaque (such as cardboard), or reflective (such as a mirror).

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        **3. Planning and carrying out investigations:** Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in K-2 builds on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions.        • Plan and conduct an investigation collaboratively to produce data to serve as the basis for evidence to answer a question.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **ELECTROMAGNETIC RADIATION**        Some materials allow light to pass through them, others allow only some light through and others block all the light and create a dark shadow on any surface beyond them, where the light cannot reach. Mirrors can be used to redirect a light beam. (The idea that light travels from place to place is developed through experiences with light sources, mirrors, and shadows, but no attempt is made to discuss the speed of light.) (LE.PS4B.b)
      </td>
      <td>
        **CAUSE AND EFFECT**        Simple tests can be designed to gather evidence to support or refute student ideas about causes.
      </td>
    </tr>
  </tbody>
</table>

---




1-PS4-4

# WAVES AND THEIR APPLICATIONS

## Performance Expectation
Use tools and materials to design and build a device that uses light or sound to solve the problem of communicating over a distance.

## Clarification Statement
Examples of devices could include a light source to send signals, paper cup and string "telephones," or a pattern of drumbeats.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        **6. Constructing explanations and designing solutions:**        Constructing explanations (science) and designing solutions (engineering) in K-2 builds on prior experiences and progresses to the use of evidence and ideas in constructing evidence-based accounts of natural phenomena and designing solutions.        • Use tools and/or materials to design and/or build a device that solves a specific problem or a solution to a specific problem.        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **INFORMATION TECHNOLOGIES AND INSTRUMENTATION**        People also use a variety of devices to communicate (send and receive information) over long distances. (LE.PS4C.a)        **DEVELOPING POSSIBLE SOLUTIONS**        A situation that people want to change or create can be approached as a problem to be solved through engineering. (LE.ETS1A.a)
      </td>
      <td>
        **SYSTEMS AND SYSTEM MODELS**        Systems in the natural and designed world have parts that work together.
      </td>
    </tr>
  </tbody>
</table>

---




1-LS1-1

# FROM MOLECULES TO ORGANISMS: STRUCTURES AND PROCESSES

## Performance Expectation
Use tools and materials to design a solution to a human problem by mimicking how plants and/or animals use their external parts to help them survive, grow, and meet their needs.

## Clarification Statement
Examples of human problems that can be solved by mimicking plant or animal solutions could include designing clothing or equipment to protect bicyclists by mimicking turtle shells, acorn shells or animal scales; stabilizing structures by mimicking animal tails or roots on plants; keeping out intruders by mimicking thorns on branches or animal quills; and detecting intruders by mimicking eyes or ears.

<table>
  <tr>
    <th>Science & Engineering Practices</th>
    <th>Disciplinary Core Ideas</th>
    <th>Crosscutting Concepts</th>
  </tr>
  <tr>
    <td>
      1. Asking questions and defining problems      2. Developing and using models      3. Planning and carrying out investigations      4. Analyzing and interpreting data      5. Using mathematics and computational thinking      <strong>6. Constructing explanations and designing solutions:</strong>      Constructing explanations (science) and designing solutions (engineering) in K-2 builds on prior experiences and progresses to the use of evidence and ideas in constructing evidence-based accounts of natural phenomena and designing solutions.      • Use tools and/or materials to design and/or build a device that solves a specific problem or a solution to a specific problem.      7. Engaging in argument from evidence      8. Obtaining, evaluating, and communicating information
    </td>
    <td>
      **STRUCTURE AND FUNCTION**      All organisms have external parts. Different animals use their body parts in different ways to see, hear, grasp objects, protect themselves, move from place to place, and seek, find, and take in food, water, and air. Plants also have different parts (roots, stems, leaves, flowers, fruits) that help them survive and grow. (LE.LS1A.a)      **INFORMATION PROCESSING**      Animals have body parts that capture and convey different kinds of information needed for growth and survival. Animals respond to these inputs with behaviors that help them survive. Plants also respond to some external inputs. (LE.LS1D.a)      **DEVELOPING POSSIBLE SOLUTIONS**      Designs can be conveyed through sketches, drawings, or physical models. These representations are useful in communicating ideas for solutions to a problem. (LE.ETS1B.a)      **OPTIMIZING THE DESIGN SOLUTION**      Because there is always more than one possible solution to a problem, it is useful to compare and test designs. (LE.ETS1C.a)
    </td>
    <td>
      **STRUCTURE AND FUNCTION**      The shape and stability of structures of natural and designed objects are related to their function(s).
    </td>
  </tr>
</table>

---




1-LS1-2

# FROM MOLECULES TO ORGANISMS: STRUCTURES AND PROCESSES

## Performance Expectation
Read grade-appropriate texts and use media to determine patterns in behavior of parents and offspring that help offspring survive.

## Clarification Statement
Examples of patterns of behaviors could include the signals that offspring make (such as crying, cheeping, and other vocalizations) and the responses of the parents (such as feeding, comforting, and protecting the offspring).

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. **Obtaining, evaluating, and communicating information:** Obtaining, evaluating, and communicating information in K-2 builds on prior experiences and uses observations and texts to communicate new information.        • Read grade-appropriate texts and/or use media to obtain scientific and/or technical information to determine patterns in and/or evidence about the natural and designed world(s).
      </td>
      <td>
        **GROWTH AND DEVELOPMENT OF ORGANISMS**        Adult plants and animals can have offspring. In many kinds of animals, parents and the offspring themselves engage in behaviors that help the offspring to survive.        (LE.LS1B.a)
      </td>
      <td>
        **PATTERNS**        Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.
      </td>
    </tr>
  </tbody>
</table>

---




1-LS3-1

# HEREDITY: INHERITANCE AND VARIATION OF TRAITS

## Performance Expectation
Make observations to construct an evidence-based account that young plants and animals are similar, but not exactly like, their parents.

## Clarification Statement
Examples of observations could include: leaves from the same kind of plant are similar in shape but can differ in size, or a particular breed of dog looks like its parents but is not exactly the same. Examples of patterns could include features that plants or animals share.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        **6. Constructing explanations and designing solutions:**        Constructing explanations (science) and designing solutions (engineering) in K-2 builds on prior experiences and progresses to the use of evidence and ideas in constructing evidence-based accounts of natural phenomena and designing solutions.        • Make observations to construct an evidence-based account for natural phenomena.        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **INHERITANCE OF TRAITS**        Young animals are very much, but not exactly like, their parents. Plants also are very much, but not exactly like, their parents. (LE.LS3A.a)        **VARIATION OF TRAITS**        Individuals of the same kind of plant or animal are recognizable as similar but can also vary in many ways. (LE.LS3B.a)
      </td>
      <td>
        **PATTERNS**        Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.
      </td>
    </tr>
  </tbody>
</table>

---




1-ESS1-1

# EARTH'S PLACE IN THE UNIVERSE

## Performance Expectation
Use observations of the sun, moon, and stars to describe patterns that can be predicted.

## Clarification Statement
Examples of patterns could include that the sun and moon appear to rise in one part of the sky, move across the sky, and set; and stars other than our sun are visible at night but not during the day.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        **4. Analyzing and interpreting data:** Analyzing and interpreting data in K-2 builds on prior experiences and progresses to collecting, recording, and sharing observations.        • Use observations to describe patterns in the natural world in order to answer scientific questions.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **THE UNIVERSE AND ITS STARS**        Patterns of the motion of the sun, moon, and stars in the sky can be observed, described, and predicted.        (LE.ESS1A.a)
      </td>
      <td>
        **PATTERNS**        Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.
      </td>
    </tr>
  </tbody>
</table>

---




1-ESS1-2

# EARTH'S PLACE IN THE UNIVERSE

| Performance Expectation | Make observations at different times of year to relate the amount of daylight to the time of year. |
|---|---|
| Clarification Statement | Emphasis is on relative comparisons of the amount of daylight in the winter to the amount in the spring, fall, or summer. |

| Science & Engineering Practices | Disciplinary Core Ideas | Crosscutting Concepts |
|---|---|---|
| 1. Asking questions and defining problems | **EARTH AND THE SOLAR SYSTEM** Seasonal patterns of sunrise and sunset can be observed, described, and predicted. (LE.ESS1B.a) | **PATTERNS** Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence. |
| 2. Developing and using models |  |  |
| **3. Planning and carrying out investigations:** Planning and carrying out investigations to answer questions or test solutions to problems in K-2 build on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions. |  |  |
| • Make observations to collect data that can be used to make comparisons. |  |  |
| 4. Analyzing and interpreting data |  |  |
| 5. Using mathematics and computational thinking |  |  |
| 6. Constructing explanations and designing solutions |  |  |
| 7. Engaging in argument from evidence |  |  |
| 8. Obtaining, evaluating, and communicating information |  |  |

---
---




2-PS1-1

# MATTER AND ITS INTERACTIONS

## Performance Expectation
Plan and conduct an investigation to describe and classify different kinds of materials by their observable properties.

## Clarification Statement
Observations could include color, texture, hardness, or flexibility. Patterns could include the similar properties that different materials share.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        **3. Planning and carrying out investigations:** Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in K-2 builds on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions.        • Plan and conduct an investigation collaboratively to produce data to serve as the basis for evidence to answer a question.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **STRUCTURE AND PROPERTIES OF MATTER**        Different kinds of matter exist and many of them can be either solid or liquid, depending on temperature. Matter can be described and classified by its observable properties. (LE.PS1A.c)
      </td>
      <td>
        **PATTERNS**        Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.
      </td>
    </tr>
  </tbody>
</table>

---




2-PS1-2

# MATTER AND ITS INTERACTIONS

## Performance Expectation
Analyze data obtained from testing different materials to determine which materials have the properties that are best suited for an intended purpose.

## Clarification Statement
Examples of properties could include, strength, flexibility, hardness, texture, or absorbency.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        **4. Analyzing and interpreting data:** Analyzing data in K-2 builds on prior experiences and progresses to collecting, recording, and sharing observations.        • Analyze data from tests of an object or tool to determine if it works as intended.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **STRUCTURE AND PROPERTIES OF MATTER**        Different properties are suited to different purposes.        (LE.PS1A.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Simple tests can be designed to gather evidence to support or refute student ideas about causes.
      </td>
    </tr>
  </tbody>
</table>

---




2-PS1-3

# MATTER AND ITS INTERACTIONS

## Performance Expectation
Make observations to construct an evidence-based account of how an object made of a small set of pieces can be disassembled and made into a new object.

## Clarification Statement
Examples of pieces could include blocks, building bricks, or other assorted small objects. Provide students with the same number of objects to create a different object.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        **6. Constructing explanations and designing solutions:**        Constructing explanations (science) and designing solutions (engineering) in K-2 builds on prior experiences and progresses to the use of evidence and ideas in constructing evidence-based accounts of natural phenomena and designing solutions.        • Make observations (firsthand or from media) to construct an evidence-based account for natural phenomena.        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **STRUCTURE AND PROPERTIES OF MATTER**        Different properties are suited to different purposes.        (LE.PS1A.a)        A great variety of objects can be built up from a small set of pieces. (LE.PS1A.b)
      </td>
      <td>
        **ENERGY AND MATTER**        Objects may break into smaller pieces, be put together into larger pieces, or change shapes.
      </td>
    </tr>
  </tbody>
</table>

---




2-PS1-4

# MATTER AND ITS INTERACTIONS

| Performance Expectation | Construct an argument with evidence that some changes caused by heating or cooling can be reversed and some cannot. |
|---|---|
| Clarification Statement | Demonstrations of reversible changes could include materials such as water, butter or crayons at different temperatures. Demonstrations of irreversible changes could include cooking an egg, freezing a plant leaf, or heating paper. |

| Science & Engineering Practices | Disciplinary Core Ideas | Crosscutting Concepts |
|---|---|---|
| 1. Asking questions and defining problems | CHEMICAL REACTIONS Heating or cooling a substance may cause changes that can be observed. Sometimes these changes are reversible, and sometimes they are not. (LE.PS1B.a) | CAUSE AND EFFECT Events have causes that generate observable patterns. |
| 2. Developing and using models |  |  |
| 3. Planning and carrying out investigations |  |  |
| 4. Analyzing and interpreting data |  |  |
| 5. Using mathematics and computational thinking |  |  |
| 6. Constructing explanations and designing solutions |  |  |
| **7. Engaging in argument from evidence:** Engaging in argument from evidence in K-2 builds on prior experiences and progresses to comparing ideas and representations about the natural and designed world(s). |  |  |
| • Construct an argument with evidence to support a claim. |  |  |
| 8. Obtaining, evaluating, and communicating information |  |  |

---
---




2-LS2-1

# ECOSYSTEMS: INTERACTIONS, ENERGY, AND DYNAMICS

## Performance Expectation
Plan and conduct an investigation to determine if plants need sunlight and water to grow.

## Clarification Statement
Emphasis is on testing one variable at a time during investigations.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in K-2 builds on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions.        • Plan and conduct an investigation collaboratively to produce data to serve as the basis for evidence to answer a question.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing a solution        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **INTERDEPENDENT RELATIONSHIPS IN ECOSYSTEMS**        Plants depend on water and light to grow. (LE.LS2A.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Events have causes that generate observable patterns.
      </td>
    </tr>
  </tbody>
</table>

---




2-LS2-2

# ECOSYSTEMS: INTERACTIONS, ENERGY, AND DYNAMICS

## Performance Expectation
Develop a simple model that mimics the function of an animal in dispersing seeds or pollinating plants.

## Clarification Statement
Students could use the model to describe: (1) How the structure of the model gives rise to its function. (2) Structure-function relationships in the natural world that allow some animals to disperse seeds or pollinate plants.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. **Developing and using models:** Modeling in K–2 builds on prior experiences and progresses to include using and developing models (e.g., diagram, drawing, physical replica, diorama, dramatization, storyboard) that represent concrete events or design solutions.        • Develop a simple model based on evidence to represent a proposed object or tool.        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **INTERDEPENDENT RELATIONSHIPS IN ECOSYSTEMS**        Plants may depend on animals for pollination or to move their seeds around. (LE.LS2A.b)
      </td>
      <td>
        **STRUCTURE AND FUNCTION**        The shape and stability of structures of natural and designed objects are related to their function(s).
      </td>
    </tr>
  </tbody>
</table>

---




2-LS4-1

# BIOLOGICAL EVOLUTION: UNITY AND DIVERSITY

| Performance Expectation | Make observations of plants and animals to compare the diversity of life in different habitats. |
|---|---|
| Clarification Statement | Emphasis is on the diversity of living things in each of a variety of different habitats. Students could explore different habitats in the community (e.g., school, aquariums, and neighborhoods). |

| Science & Engineering Practices | Disciplinary Core Ideas | Crosscutting Concepts |
|---|---|---|
| 1. Asking questions and defining problems | BIODIVERSITY AND HUMANS | PATTERNS |
| 2. Developing and using models | There are many kinds of living things in any area, and they exist in different places on land, in water, and in air. (LE.LS4D.a) | Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence. |
| 3. Planning and carrying out investigations: Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in K-2 builds on prior experiences and progresses to simple investigations, based on fair tests, which provide data to support explanations or design solutions. | • Make observations and/or measurements to collect data that can be used to make comparisons. | |
| 4. Analyzing and interpreting data | | |
| 5. Using mathematics and computational thinking | | |
| 6. Constructing explanations and designing solutions | | |
| 7. Engaging in argument from evidence | | |
| 8. Obtaining, evaluating, and communicating information | | |

---




2-ESS1-1

# EARTH'S PLACE IN THE UNIVERSE

## Performance Expectation
Use information from several sources to provide evidence that Earth events can occur quickly or slowly.

## Clarification Statement
Examples of events and timescales could include volcanic explosions and earthquakes, which happen quickly, and erosion of rocks, which occurs slowly.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. **Obtaining, evaluating, and communicating information:** Obtaining, evaluating, and communicating information in K–2 builds on prior experiences and uses observations and texts to communicate new information.
        <ul>
          <li>Obtain information using various texts, text features (e.g., headings, tables of contents, glossaries, electronic menus, icons), and other media that will be useful in answering a scientific question and/or supporting a scientific claim.</li>
        </ul>
      </td>
      <td>
        **THE HISTORY OF PLANET EARTH**        Some events happen very quickly; others occur very slowly, over a time period much longer than one can observe. (LE.ESS1C.a)        **DEFINING AND DELIMITING ENGINEERING PROBLEMS**        Asking questions, making observations, and gathering information are helpful in thinking about problems. (ETS.LE.1A.b)
      </td>
      <td>
        **STABILITY AND CHANGE**        Things may change slowly or rapidly.
      </td>
    </tr>
  </tbody>
</table>

---




2-ESS2-1

# EARTH'S SYSTEMS

## Performance Expectation
Compare multiple solutions designed to slow or prevent wind or water from changing the shape of the land.

## Clarification Statement
Examples of solutions could include different designs of dikes and windbreaks to hold back wind and water, and different designs for using shrubs, grass, and trees to hold back the land.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models
3. Planning and carrying out investigations
4. Analyzing and interpreting data
5. Using mathematics and computational thinking
6. **Constructing explanations and designing solutions:** Constructing explanations (science) and designing solutions (engineering) in K–2 builds on prior experiences and progresses to the use of evidence and ideas in constructing evidence-based accounts of natural phenomena and designing solutions.
   * Generate and/or compare multiple solutions to a problem.
7. Engaging in argument from evidence
8. Obtaining, evaluating, and communicating information

## Disciplinary Core Ideas

**EARTH MATERIALS AND SYSTEMS**
Wind and water can change the shape of the land. (LE.ESS2A.a)

**OPTIMIZING THE DESIGN SOLUTION**
Because there is always more than one possible solution to a problem, it is useful to compare and test designs. (LE.ETS1C.a)

## Crosscutting Concepts

**STABILITY AND CHANGE**
Things may change slowly or rapidly.

---

---




2-ESS2-2

# EARTH'S SYSTEMS

## Performance Expectation
Develop a model to represent the shapes and kinds of land and bodies of water in an area.

## Clarification Statement
Models do not have to be to scale.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. **Developing and using models:** Modeling in K-2 builds on prior experiences and progresses to include using and developing models (i.e., diagram, drawing, physical replica, diorama, dramatization, storyboard) that represent concrete events or design solutions.        • Develop and/or use a model to represent amounts, relationships, relative scales (bigger, smaller), and/or patterns in the natural and designed world(s).        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **PLATE TECTONICS AND LARGE-SCALE SYSTEM INTERACTIONS**        Maps show where things are located. One can map the shapes and kinds of land and water in any area.        (LE.ESS2B.a)        **DEVELOPING POSSIBLE SOLUTIONS**        Designs can be conveyed through sketches, drawings, or physical models. These representations are useful in communicating ideas for solutions to a problem.        (ETS.LE.1B.a)
      </td>
      <td>
        **PATTERNS**        Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.
      </td>
    </tr>
  </tbody>
</table>

---




2-ESS2-3

# EARTH'S SYSTEMS

## Performance Expectation
Obtain and communicate information to identify where water is found on Earth and that it can be solid or liquid.

## Clarification Statement
Students use reliable sources to identify the patterns of where water is found and its natural form (solid or liquid). Examples of how water can be found on Earth as water or ice could include a frozen pond, a liquid pond, a frozen lake, or a liquid lake.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models
3. Planning and carrying out investigations
4. Analyzing and interpreting data
5. Using mathematics and computational thinking
6. Constructing explanations and designing solutions
7. Engaging in argument from evidence

8. **Obtaining, evaluating, and communicating information:** Obtaining, evaluating, and communicating information in K–2 builds on prior experiences and uses observations and texts to communicate new information.

* Obtain information using various texts, text features (e.g., headings, tables of contents, glossaries, electronic menus, icons), and other media that will be useful in answering a scientific question and/or supporting a scientific claim.

## Disciplinary Core Ideas

**THE ROLES OF WATER IN EARTH'S SURFACE PROCESSES**
Water is found in the ocean, rivers, lakes, and ponds. Water exists as solid ice and in liquid form. (LE.ESS2C.a)

## Crosscutting Concepts

**PATTERNS**
Patterns in the natural and human designed world can be observed, used to describe phenomena, and used as evidence.

---
---




3-PS2-1
# MOTION AND STABILITY: FORCES AND INTERACTIONS

## Performance Expectation
Plan and conduct an investigation to provide evidence of the effects of balanced and unbalanced forces on the motion of an object.

## Clarification Statement
Examples could include an unbalanced force on one side of an object that can make it start moving, or balanced forces pushing on an object from opposite sides will not produce any motion at all. Investigations include one variable at a time: number, size, or direction of forces.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        **3. Planning and carrying out investigations:** Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in 3–5 builds on K–2 experiences and progresses to include investigations that control variables and provide evidence to support explanations or design solutions.        • Plan and conduct an investigation collaboratively to produce data to serve as the basis for evidence, using fair tests in which variables are controlled and the number of trials considered.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **FORCES AND MOTION**        Each force acts on one particular object and has both strength and a direction. An object at rest typically has multiple forces acting on it but they add to give zero net force on the object. (UE.PS2A.a)        Forces that do not sum to zero can cause changes in the object’s speed or direction of motion. (Qualitative and conceptual, but not quantitative addition of forces are used at this level.) (UE.PS2A.b)        **TYPES OF INTERACTIONS**        Objects in contact exert forces on each other. (UE.PS2B.a)
      </td>
      <td>
        **CAUSE AND EFFECT**        Cause and effect relationships are routinely identified, tested, and used to explain change.
      </td>
    </tr>
  </tbody>
</table>

---




3-PS2-2

# MOTION AND STABILITY: FORCES AND INTERACTIONS

## Performance Expectation
Make observations and/or measurements of an object's motion to provide evidence that a pattern can be used to predict future motion.

## Clarification Statement
Examples of motion with a predictable pattern could include a child swinging in a swing, a ball rolling back and forth in a bowl, or two children on a see-saw.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        **3. Planning and carrying out investigations:** Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in 3–5 builds on K–2 experiences and progresses to include investigations that control variables and provide evidence to support explanations or design solutions.        • Make observations and/or measurements to produce data to serve as the basis for evidence for an explanation of a phenomenon or test a design solution.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **FORCES AND MOTION**        The patterns of an object’s motion in various situations can be observed and measured; when that past motion exhibits a regular pattern, future motion can be predicted from it. (Technical terms, such as magnitude, velocity, momentum, and vector quantity, are not introduced at this level, but the concept that some quantities need both size and direction to be described is developed.) (UE.PS2A.c)
      </td>
      <td>
        **PATTERNS**        Patterns of change can be used to make predictions.
      </td>
    </tr>
  </tbody>
</table>

---




3-PS2-3

# MOTION AND STABILITY: FORCES AND INTERACTIONS

## Performance Expectation
Ask questions to determine cause and effect relationships of electric or magnetic interactions between two objects not in contact with each other.

## Clarification Statement
Examples of an electric force could include the force on hair from an electrically charged balloon or the electrical forces between a charged rod and pieces of paper; examples of a magnetic force could include the force between two permanent magnets, the force between an electromagnet and steel paper clips, or the force exerted by one magnet versus the force exerted by two magnets. Examples of cause and effect relationships could include how the distance between objects affects the strength of the force or how the orientation of magnets affects the direction of the magnetic force. Examples could include forces produced by objects that can be manipulated by students, or electrical interactions could include static electricity.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. **Asking questions and defining problems:** Asking questions (science) and defining problems (engineering) in 3–5 builds on K–2 experiences and progresses to specifying qualitative relationships.
        <ul>
          <li>Ask questions that can be investigated and predict reasonable outcomes based on patterns such as cause and effect relationships.</li>
        </ul>
        2. Developing and using models
        3. Planning and carrying out investigations
        4. Analyzing and interpreting data
        5. Using mathematics and computational thinking
        6. Constructing explanations (for science) and designing solutions (for engineering)
        7. Engaging in argument from evidence
        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **TYPES OF INTERACTIONS**
        Electric and magnetic forces between a pair of objects do not require that the objects be in contact. The sizes of the forces in each situation depend on the properties of the objects and their distances apart and, for forces between two magnets, on their orientation relative to each other. (UE.PS2B.b)
      </td>
      <td>
        **CAUSE AND EFFECT**
        Cause and effect relationships are routinely identified, tested, and used to explain change.
      </td>
    </tr>
  </tbody>
</table>

---




3-PS2-4

# MOTION AND STABILITY: FORCES AND INTERACTIONS

<table>
  <thead>
    <tr>
      <th>Performance Expectation</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Define a simple design problem that can be solved by applying scientific ideas about magnets.</td>
      <td></td>
    </tr>
    <tr>
      <td>Clarification Statement</td>
      <td>Examples of problems could include constructing a latch to keep a door shut or creating a device to keep two moving objects from touching each other.</td>
    </tr>
  </tbody>
</table>

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems: Asking questions (science) and defining problems (engineering) in 3–5 builds on K–2 experiences and progresses to specifying qualitative relationships.
        <ul>
          <li>Define a simple design problem that can be solved through the development of an object, tool, process, or system and includes several criteria for success and constraints on materials, time, or cost.</li>
        </ul>
        2. Developing and using models
        3. Planning and carrying out investigations
        4. Analyzing and interpreting data
        5. Using mathematics and computational thinking
        6. Constructing explanations (for science) and designing solutions (for engineering)
        7. Engaging in argument from evidence
        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **TYPES OF INTERACTIONS**
        Electric and magnetic forces between a pair of objects do not require that the objects be in contact. The sizes of the forces in each situation depend on the properties of the objects and their distances apart and, for forces between two magnets, their orientation relative to each other. (UE.PS2B.b)

        **DEFINING AND DELIMITING ENGINEERING PROBLEMS**
        Possible solutions to a problem are limited by available materials and resources (constraints). The success of a designed solution is determined by considering the desired features of a solution (criteria). Different proposals for solutions can be compared on the basis of how well each one meets the specified criteria for success or how well each takes the constraints into account. (UE.ETS1A.a)
      </td>
      <td>
        **PATTERNS**
        Patterns can be used as evidence to support an explanation.
      </td>
    </tr>
  </tbody>
</table>

---




# FROM MOLECULES TO ORGANISMS: STRUCTURES AND PROCESSES

## Performance Expectation
Develop models to describe that organisms have unique and diverse life cycles but all have in common birth, growth, reproduction, and death.

## Clarification Statement
Changes that organisms go through during their lives form a pattern. For plant life cycles there is an emphasis on flowering plants.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. **Developing and using models:** Modeling in 3-5 builds on K-2 experiences and progresses to building and revising simple models and using models to represent events and design solutions.        • Develop and/or use models to describe and/or predict phenomena.        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **GROWTH AND DEVELOPMENT OF ORGANISMS**        Reproduction is essential to the continued existence of every kind of organism. Plants and animals have unique and diverse life cycles. (UE.LS1B.a)
      </td>
      <td>
        **PATTERNS**        Patterns of change can be used to make predictions.
      </td>
    </tr>
  </tbody>
</table>

<footer>
5</footer>

---




# ECOSYSTEMS: INTERACTIONS, ENERGY, AND DYNAMICS

## Performance Expectation
Construct and support an argument that some animals form groups that help members survive.

## Clarification Statement
Arguments could include examples of group behavior such as division of labor in a bee colony, flocks of birds staying together to confuse or intimidate predators, or wolves hunting in packs to more efficiently catch and kill prey.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        **7. Engaging in argument from evidence:** Engaging in argument from evidence in 3–5 builds on K–2 experiences and progresses to critiquing the scientific explanations or solutions proposed by peers by citing relevant evidence about the natural and designed world(s).        • Construct and/or support an argument with evidence, data, and/or a model.        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **SOCIAL INTERACTIONS AND GROUP BEHAVIOR**        Being part of a group helps animals obtain food, defend themselves, and cope with changes. Groups may serve different functions and vary dramatically in size.        (UE.LS2D.a)
      </td>
      <td>
        **SYSTEMS AND SYSTEM MODELS**        A system is a group of related parts that make up a whole and can carry out functions its individual parts cannot.
      </td>
    </tr>
  </tbody>
</table>

<footer>
6</footer>

---




# HEREDITY: INHERITANCE AND VARIATION OF TRAITS

## Performance Expectation
Analyze and interpret data to provide evidence that plants and animals have traits inherited from their parents and that variation of these traits exists in a group of similar organisms.

## Clarification Statement
Emphasis is on organisms other than humans and does not include genetic mechanisms of inheritance and prediction of traits. Data can include drawings, photographs, measurements, or written observations. Patterns are the similarities and differences in traits shared between offspring and their parents, or among siblings.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        **4. Analyzing and interpreting data:** Analyzing data in 3-5 builds on K-2 experiences and progresses to introducing quantitative approaches to collecting data and conducting multiple trials of qualitative observations. When possible and feasible, digital tools should be used.        • Analyze and interpret data to make sense of phenomena, using logical reasoning, mathematics, and/or computation.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **INHERITANCE OF TRAITS**        Many characteristics of organisms are inherited from their parents. (UE.LS3A.a)        **VARIATION OF TRAITS**        Different organisms vary in how they look and function because they have different inherited information. (UE.LS3B.a)
      </td>
      <td>
        **PATTERNS**        Similarities and differences in patterns can be used to sort, classify, communicate and analyze simple rates of change for natural phenomena and designed products.
      </td>
    </tr>
  </tbody>
</table>

<footer>
7</footer>

---




3-LS3-2

# HEREDITY: INHERITANCE AND VARIATION OF TRAITS

| Performance Expectation | Use evidence to support the explanation that traits can be influenced by the environment. |
|---|---|
| Clarification Statement | Examples of the environment affecting a trait could include normally tall plants grown with insufficient water are stunted or an animal that is given too much food and little exercise may become overweight. |

| Science & Engineering Practices | Disciplinary Core Ideas | Crosscutting Concepts |
|---|---|---|
| 1. Asking questions and defining problems | **INHERITANCE OF TRAITS** Other characteristics result from individuals’ interactions with the environment, which can range from diet to learning. Many characteristics involve both inheritance and environment. (UE.LS3A.b) | **CAUSE AND EFFECT** Cause and effect relationships are routinely identified, tested, and used to explain change. |
| 2. Developing and using models | **VARIATION OF TRAITS** The environment also affects the traits that an organism expresses. (UE.LS3B.b) | |
| 3. Planning and carrying out investigations | | |
| 4. Analyzing and interpreting data | | |
| 5. Using mathematics and computational thinking | | |
| **6. Constructing explanations and designing solutions:** Constructing explanations (science) and designing solutions (engineering) in 3–5 builds on K–2 experiences and progresses to the use of evidence in constructing explanations that specify variables that describe and predict phenomena and in designing multiple solutions to design problems. | | |
| • Use evidence (e.g., measurements, observations, patterns) to construct or support an explanation or design a solution to a problem. | | |
| 7. Engaging in argument from evidence | | |
| 8. Obtaining, evaluating, and communicating information | | |

---
---




3-LS4-1

# BIOLOGICAL EVOLUTION: UNITY AND DIVERSITY

## Performance Expectation
Analyze and interpret data from fossils to provide evidence of the organisms and the environments in which they lived long ago.

## Clarification Statement
Examples of data could include type, size, and distributions of fossil organisms. Examples of fossils and environments could include major fossil types such as marine fossils found on dry land, tropical plant fossils found in arctic areas, or fossils of extinct organisms and relative ages.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations.        **4. Analyzing and interpreting data:** Analyzing data in 3–5 builds on K–2 experiences and progresses to introducing quantitative approaches to collecting data and conducting multiple trials of qualitative observations. When possible and feasible, digital tools should be used.        • Analyze and interpret data to make sense of phenomena, using logical reasoning, mathematics, and/or computation.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **EVIDENCE OF COMMON ANCESTRY AND DIVERSITY**        Some kinds of plants and animals that once lived on Earth are no longer found anywhere. (UE.LS4A.a)        Fossils provide evidence about the types of organisms that lived long ago and also about the nature of their environment. (UE.LS4A.b)
      </td>
      <td>
        **SCALE, PROPORTION, AND QUANTITY**        Natural objects and/or observable phenomena exist from the very small to the immensely large or from very short to very long time periods.
      </td>
    </tr>
  </tbody>
</table>

---




3-LS4-2

# BIOLOGICAL EVOLUTION: UNITY AND DIVERSITY

## Performance Expectation
Use evidence to construct an explanation for how the variations in characteristics among individuals of the same species may provide advantages in surviving, finding mates, and reproducing.

## Clarification Statement
Examples of cause and effect relationships could be plants that have larger thorns than other plants may be less likely to be eaten or animals that have better camouflage coloration than other animals may be more likely to survive and therefore more likely to leave offspring.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models
3. Planning and carrying out investigations.
4. Analyzing and interpreting data
5. Using mathematics and computational thinking

6. **Constructing explanations and designing solutions:**
   Constructing explanations (science) and designing solutions (engineering) in 3–5 builds on K–2 experiences and progresses to the use of evidence in constructing explanations that specify variables that describe and predict phenomena and in designing multiple solutions to design problems.
   
   • Use evidence (e.g., measurements, observations, patterns) to construct or support an explanation or design a solution to a problem.

7. Engaging in argument from evidence
8. Obtaining, evaluating, and communicating information

## Disciplinary Core Ideas
**NATURAL SELECTION**
Sometimes the differences in characteristics between individuals of the same species provide advantages in surviving, finding mates, and reproducing. (UE.LS4B.a)

## Crosscutting Concepts
**CAUSE AND EFFECT**
Cause and effect relationships are routinely identified, tested, and used to explain change.

---




3-LS4-3

# BIOLOGICAL EVOLUTION: UNITY AND DIVERSITY

## Performance Expectation
Construct and support an argument with evidence that in a particular habitat some organisms can survive well, some survive less well, and some cannot survive at all.

## Clarification Statement
Examples of evidence could include needs and characteristics of the organisms and habitats involved. The organisms and their habitats make up a system in which the parts depend on each other.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        <b>7. Engaging in argument from evidence:</b> Engaging in argument from evidence in 3–5 builds on K–2 experiences and progresses to critiquing the scientific explanations or solutions proposed by peers by citing relevant evidence about the natural and designed world(s).        • Construct and/or support an argument with evidence, data, and/or a model.        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        <b>ADAPTATION</b>        For any particular environment, some kinds of organisms survive well, some survive less well, and some cannot survive at all. (UE.LS4C.a)
      </td>
      <td>
        <b>CAUSE AND EFFECT</b>        Cause and effect relationships are routinely identified, tested, and used to explain change.
      </td>
    </tr>
  </tbody>
</table>

<footer>
11</footer>

---




3-LS4-4

# BIOLOGICAL EVOLUTION: UNITY AND DIVERSITY

## Performance Expectation
Make a claim about the merit of a solution to a problem caused when the environment changes and the types of plants and animals that live there may change.

## Clarification Statement
Examples of environmental change(s) could include changes in land characteristics, water distribution, temperature, food, and other biological communities. Louisiana specific examples could include impacts related to levees, dams, crop rotations, irrigation systems, hunting limits, diversion canals, or sea level rise.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        **7. Engaging in argument from evidence:** Engaging in argument from evidence in 3–5 builds on K–2 experiences and progresses to critiquing the scientific explanations or solutions proposed by peers by citing relevant evidence about the natural and designed world(s).        • Make a claim about the merit of a solution to a problem by citing relevant evidence about how it meets the criteria and constraints of a problem.        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **ECOSYSTEM DYNAMICS, FUNCTIONING, AND RESILIENCE**        When the environment changes in ways that affect a place’s physical characteristics, temperature, or availability of resources, some organisms survive and reproduce, others move to new locations, yet others move into the transformed environment, and some die.        (UE.LS2C.a)        **BIODIVERSITY AND HUMANS**        Populations live in a variety of habitats, and change in those habitats affects the organisms living there.        (UE.LS4D.a)        **DEVELOPING POSSIBLE SOLUTIONS**        At whatever stage, communicating with peers about proposed solutions is an important part of the design process, and shared ideas can lead to improved designs.        (ETS.UE.1B.b)
      </td>
      <td>
        **SYSTEMS AND SYSTEM MODELS**        A system can be described in terms of its components and their interactions.
      </td>
    </tr>
  </tbody>
</table>

---




# EARTH'S SYSTEMS

## Performance Expectation
Represent data in tables and graphical displays to describe typical weather conditions expected during a particular season.

## Clarification Statement
Examples of data could include average temperature, precipitation, and wind direction. Examples of data representations could include pictographs and bar graphs.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out investigations        **4. Analyzing and interpreting data:** Analyzing data in 3–5 builds on K–2 experiences and progresses to introducing quantitative approaches to collecting data and conducting multiple trials of qualitative observations. When possible and feasible, digital tools should be used.        • Represent data in tables and/or various graphical displays (bar graphs, pictographs and/or pie charts) to reveal patterns that indicate relationships.        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **WEATHER AND CLIMATE**        Scientists record patterns of the weather across different times and areas so that they can make predictions about what kind of weather might happen next. (UE.ESS2D.a)
      </td>
      <td>
        **PATTERNS**        Patterns of change can be used to make predictions.
      </td>
    </tr>
  </tbody>
</table>

---




3-ESS2-2

# EARTH'S SYSTEMS

## Performance Expectation
Obtain and combine information to describe climates in different regions around the world.

## Clarification Statement
Information could include rainfall and temperature data.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models
3. Planning and carrying out investigations
4. Analyzing and interpreting data
5. Using mathematics and computational thinking
6. Constructing explanations and designing solutions
7. Engaging in argument from evidence

8. **Obtaining, evaluating, and communicating information:** Obtaining, evaluating, and communicating information in 3–5 builds on K–2 experiences and progresses to evaluating the merit and accuracy of ideas and methods

* Obtain and combine information from books and/or other reliable media to explain phenomena or solutions to a design problem.

## Disciplinary Core Ideas

**WEATHER AND CLIMATE**
Climate describes a range of an area’s typical weather conditions and the extent to which those conditions vary over years. (UE.ESS2D.b)

## Crosscutting Concepts

**PATTERNS**
Patterns of change can be used to make predictions.

---
---




3-ESS3-1

# EARTH AND HUMAN ACTIVITY

## Performance Expectation
Make a claim about the merit of a design solution that reduces the impact of a weather-related hazard.

## Clarification Statement
Examples of design solutions to weather-related hazards could include barriers to prevent flooding (including levees), wind-resistant roofs, tornado shelters and lightning rods.

## Science & Engineering Practices

1. Asking questions and defining problems
2. Developing and using models
3. Planning and carrying out investigations
4. Analyzing and interpreting data
5. Using mathematics and computational thinking
6. Constructing explanations and designing solutions

7. **Engaging in argument from evidence:** Engaging in argument from evidence in 3–5 builds on K–2 experiences and progresses to critiquing the scientific explanations or solutions proposed by peers by citing relevant evidence about the natural and designed world(s).

   * Make a claim about the merit of a solution to a problem by citing relevant evidence about how it meets the criteria and constraints of the problem

8. Obtaining, evaluating, and communicating information

## Disciplinary Core Ideas

**NATURAL HAZARDS**
A variety of natural hazards result from natural processes. Humans cannot eliminate natural hazards but can take steps to reduce their impacts. (UE.ESS3B.a)

**DEVELOPING POSSIBLE SOLUTIONS**
Research on a problem should be carried out before beginning to design a solution. Testing a solution involves investigating how well it performs under a range of likely conditions. (ETS.UE.1B.a)

## Crosscutting Concepts

**CAUSE AND EFFECT**
Cause and effect relationships are routinely identified, tested, and used to explain change.

---




4-PS3-1

# ENERGY

## Performance Expectation
Use evidence to construct an explanation relating the speed of an object to the energy of that object.

## Clarification Statement
Relating the speed of an object to the energy of the object does not require calculation of the object's speed.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        3. Planning and carrying out Investigations        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        **6. Constructing explanations and designing solutions:**        Constructing explanations (science) and designing solutions (engineering) in 3-5 builds on K-2 experiences and progresses to the use of evidence in constructing explanations that specify variables that describe and predict phenomena and in designing multiple solutions to design problems        • Use evidence (e.g., measurements, observations, patterns) to construct or support an explanation or design a solution to a problem.        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **DEFINITIONS OF ENERGY**        The faster a given object is moving, the more energy it possesses. (UE.PS3A.a)
      </td>
      <td>
        **ENERGY AND MATTER**        Energy can be transferred in various ways and between objects.
      </td>
    </tr>
  </tbody>
</table>

---




4-PS3-2

# ENERGY

## Performance Expectation
Make observations to provide evidence that energy can be transferred from place to place by sound, light, heat, and electric currents.

## Clarification Statement
When energy is transferred it may change forms such as when light from the sun warms a window pane.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. Asking questions and defining problems        2. Developing and using models        **3. Planning and carrying out Investigations:** Planning and carrying out investigations to answer questions (science) or test solutions (engineering) to problems in 3–5 builds on K–2 experiences and progresses to include investigations that control variables and provide evidence to support explanations or design solutions.        • Make observations and/or measurements to produce data to serve as the basis for evidence for an explanation of a phenomenon or test a design solution.        4. Analyzing and interpreting data        5. Using mathematics and computational thinking        6. Constructing explanations and designing solutions        7. Engaging in argument from evidence        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **DEFINITIONS OF ENERGY**        Energy can be moved from place to place by moving objects or through sound, light, or electric currents.        (UE.PS3A.b)        **CONSERVATION OF ENERGY AND ENERGY TRANSFER**        Energy is present whenever there are moving objects, sound, light, or heat. When objects collide, energy can be transferred from one object to another, thereby changing their motion. In such collisions, some energy is typically also transferred to the surrounding air; as a result, the air gets heated and sound is produced.        (UE.PS3B.a)        Light also transfers energy from place to place.        (UE.PS3B.b)        Energy can also be transferred from place to place by electric currents, which can then be used locally to produce motion, sound, heat, or light. The currents may have been produced to begin with by transforming the energy of motion into electrical energy.        (UE.PS3B.c)
      </td>
      <td>
        **ENERGY AND MATTER**        Energy can be transferred in various ways and between objects.
      </td>
    </tr>
  </tbody>
</table>

---




4-PS3-3

# ENERGY

## Performance Expectation
Ask questions and predict outcomes about the changes in energy that occur when objects collide.

## Clarification Statement
Emphasis is on the change in the energy due to the change in speed, not on the forces, as objects interact. Quantitative measurements of energy are not included.

<table>
  <thead>
    <tr>
      <th>Science & Engineering Practices</th>
      <th>Disciplinary Core Ideas</th>
      <th>Crosscutting Concepts</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        1. **Asking questions and defining problems:** Asking questions (science) and defining problems (engineering) in 3–5 builds on K–2 experiences and progresses to specifying qualitative relationships.
        <ul>
          <li>Ask questions that can be investigated and predict reasonable outcomes based on patterns such as cause and effect relationships.</li>
        </ul>
        2. Developing and using models
        3. Planning and carrying out Investigations
        4. Analyzing and interpreting data
        5. Using mathematics and computational thinking
        6. Constructing explanations and designing solutions
        7. Engaging in argument from evidence
        8. Obtaining, evaluating, and communicating information
      </td>
      <td>
        **DEFINITIONS OF ENERGY**
        Energy can be moved from place to place by moving objects or through sound, light, or electric currents. (UE.PS3A.b)
        **CONSERVATION OF ENERGY AND ENERGY TRANSFER**
        Energy is present whenever there are moving objects, sound, light, or heat. When objects collide, energy can be transferred from one object to another, thereby changing their motion. In such collisions, some energy is typically also transferred to the surrounding air; as a result, the air gets heated and sound is produced. (UE.PS3B.a)
        **RELATIONSHIP BETWEEN ENERGY AND FORCES**
        When objects collide, the contact forces transfer energy so as to change the objects’ motions. (UE.PS3C.a)
      </td>
      <td>
        **ENERGY AND MATTER**
        Energy can be transferred in various ways and between objects.
      </td>
    </tr>
  </tbody>
</table>
