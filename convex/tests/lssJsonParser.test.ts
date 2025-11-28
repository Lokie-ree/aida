import { expect, test, describe } from "vitest";
import { parseLSSJSON, StandardData } from "../lssJsonParser";

describe("LSS JSON Parser", () => {
  describe("Valid JSON Parsing", () => {
    test("parses valid ELA standard", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "2",
          subject: "ela",
          standardText: "Ask and answer such questions as who, what, where, when, why, and how to demonstrate understanding of key details in a text.",
          strand: "RL",
          cognitiveDepth: "recall",
        },
      ]);

      const standards = parseLSSJSON(json);

      expect(standards).toHaveLength(1);
      expect(standards[0]).toMatchObject({
        standardCode: "RL.2.1",
        gradeLevel: "2",
        subject: "ela",
        standardText: expect.stringContaining("Ask and answer"),
        strand: "RL",
        cognitiveDepth: "recall",
      });
    });

    test("parses valid Math K-8 standard", () => {
      const json = JSON.stringify([
        {
          standardCode: "3.NBT.A.3",
          gradeLevel: "3",
          subject: "math",
          standardText: "Multiply one-digit whole numbers by multiples of 10 in the range 10–90 using strategies based on place value and properties of operations.",
          domain: "NBT",
          cluster: "A",
          cognitiveDepth: "application",
        },
      ]);

      const standards = parseLSSJSON(json);

      expect(standards).toHaveLength(1);
      expect(standards[0]).toMatchObject({
        standardCode: "3.NBT.A.3",
        gradeLevel: "3",
        subject: "math",
        domain: "NBT",
        cluster: "A",
        cognitiveDepth: "application",
      });
    });

    test("parses valid Math high school standard", () => {
      const json = JSON.stringify([
        {
          standardCode: "GM: G-SRT.B.5",
          gradeLevel: "9-10",
          subject: "math",
          standardText: "Use congruence and similarity criteria for triangles to solve problems and to prove relationships in geometric figures.",
          course: "GM",
          domain: "SRT",
          cluster: "B",
        },
      ]);

      const standards = parseLSSJSON(json);

      expect(standards).toHaveLength(1);
      expect(standards[0]).toMatchObject({
        standardCode: "GM: G-SRT.B.5",
        gradeLevel: "9-10",
        subject: "math",
        course: "GM",
        domain: "SRT",
        cluster: "B",
      });
    });

    test("parses multiple standards", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.3.1",
          gradeLevel: "3",
          subject: "ela",
          standardText: "Ask and answer questions.",
          strand: "RL",
        },
        {
          standardCode: "RL.3.2",
          gradeLevel: "3",
          subject: "ela",
          standardText: "Recount stories.",
          strand: "RL",
        },
        {
          standardCode: "RI.3.4",
          gradeLevel: "3",
          subject: "ela",
          standardText: "Determine the meaning of words.",
          strand: "RI",
        },
      ]);

      const standards = parseLSSJSON(json);

      expect(standards).toHaveLength(3);
      expect(standards[0].standardCode).toBe("RL.3.1");
      expect(standards[1].standardCode).toBe("RL.3.2");
      expect(standards[2].standardCode).toBe("RI.3.4");
    });

    test("handles optional fields", () => {
      const json = JSON.stringify([
        {
          standardCode: "W.5.1a",
          gradeLevel: "5",
          subject: "ela",
          standardText: "Introduce precise claim(s).",
          strand: "W",
          subStandard: "a",
          performanceExpectations: "Students will be able to write clear arguments.",
        },
      ]);

      const standards = parseLSSJSON(json);

      expect(standards).toHaveLength(1);
      expect(standards[0].subStandard).toBe("a");
      expect(standards[0].performanceExpectations).toBe(
        "Students will be able to write clear arguments."
      );
    });
  });

  describe("Validation", () => {
    test("rejects invalid JSON", () => {
      expect(() => {
        parseLSSJSON("invalid json");
      }).toThrow("Invalid JSON");
    });

    test("rejects non-array JSON", () => {
      const json = JSON.stringify({ standardCode: "RL.2.1" });

      expect(() => {
        parseLSSJSON(json);
      }).toThrow("JSON must contain an array of standards");
    });

    test("rejects missing required fields", () => {
      const json = JSON.stringify([
        {
          gradeLevel: "2",
          subject: "ela",
          standardText: "Some text",
        },
      ]);

      expect(() => {
        parseLSSJSON(json);
      }).toThrow();
    });

    test("rejects invalid subject", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "2",
          subject: "invalid",
          standardText: "Some text",
        },
      ]);

      // Should throw error because all standards failed validation
      expect(() => {
        parseLSSJSON(json);
      }).toThrow("All standards failed validation");
    });

    test("rejects invalid grade level", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "13", // Invalid grade
          subject: "ela",
          standardText: "Some text",
        },
      ]);

      // Should throw error because all standards failed validation
      expect(() => {
        parseLSSJSON(json);
      }).toThrow("All standards failed validation");
    });

    test("rejects invalid cognitive depth", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "2",
          subject: "ela",
          standardText: "Some text",
          cognitiveDepth: "invalid",
        },
      ]);

      // Should throw error because all standards failed validation
      expect(() => {
        parseLSSJSON(json);
      }).toThrow("All standards failed validation");
    });

    test("validates ELA strand", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "2",
          subject: "ela",
          standardText: "Some text",
          strand: "INVALID",
        },
      ]);

      // Should throw error because all standards failed validation
      expect(() => {
        parseLSSJSON(json);
      }).toThrow("All standards failed validation");
    });

    test("validates Math course", () => {
      const json = JSON.stringify([
        {
          standardCode: "INVALID: G-SRT.B.5",
          gradeLevel: "9-10",
          subject: "math",
          standardText: "Some text",
          course: "INVALID",
        },
      ]);

      // Should throw error because all standards failed validation
      expect(() => {
        parseLSSJSON(json);
      }).toThrow("All standards failed validation");
    });

    test("accepts valid grade levels", () => {
      const validGrades = ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "9-10", "11-12"];

      for (const grade of validGrades) {
        const json = JSON.stringify([
          {
            standardCode: "RL.2.1",
            gradeLevel: grade,
            subject: "ela",
            standardText: "Some text",
          },
        ]);

        const standards = parseLSSJSON(json);
        expect(standards.length).toBe(1);
        expect(standards[0].gradeLevel).toBe(grade);
      }
    });

    test("accepts valid subjects", () => {
      const validSubjects = ["ela", "math", "science", "social_studies"];

      for (const subject of validSubjects) {
        const json = JSON.stringify([
          {
            standardCode: "TEST.1.1",
            gradeLevel: "1",
            subject: subject,
            standardText: "Some text",
          },
        ]);

        const standards = parseLSSJSON(json);
        expect(standards.length).toBe(1);
        expect(standards[0].subject).toBe(subject);
      }
    });

    test("accepts valid cognitive depth values", () => {
      const validDepths = ["recall", "application", "synthesis"];

      for (const depth of validDepths) {
        const json = JSON.stringify([
          {
            standardCode: "RL.2.1",
            gradeLevel: "2",
            subject: "ela",
            standardText: "Some text",
            cognitiveDepth: depth,
          },
        ]);

        const standards = parseLSSJSON(json);
        expect(standards.length).toBe(1);
        expect(standards[0].cognitiveDepth).toBe(depth);
      }
    });
  });

  describe("Error Handling", () => {
    test("handles mixed valid and invalid standards", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "2",
          subject: "ela",
          standardText: "Valid standard",
        },
        {
          gradeLevel: "2", // Missing standardCode
          subject: "ela",
          standardText: "Invalid standard",
        },
        {
          standardCode: "RL.2.2",
          gradeLevel: "2",
          subject: "ela",
          standardText: "Another valid standard",
        },
      ]);

      const standards = parseLSSJSON(json);
      // Should parse valid standards and skip invalid ones
      expect(standards.length).toBe(2);
      expect(standards[0].standardCode).toBe("RL.2.1");
      expect(standards[1].standardCode).toBe("RL.2.2");
    });

    test("throws error if all standards fail validation", () => {
      const json = JSON.stringify([
        {
          gradeLevel: "2", // Missing required fields
          subject: "ela",
        },
      ]);

      expect(() => {
        parseLSSJSON(json);
      }).toThrow("All standards failed validation");
    });

    test("warns but continues if some standards fail", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "2",
          subject: "ela",
          standardText: "Valid",
        },
        {
          gradeLevel: "2", // Invalid
          subject: "ela",
        },
      ]);

      // Should not throw, but should log warnings
      const standards = parseLSSJSON(json);
      expect(standards.length).toBe(1);
    });
  });

  describe("Data Transformation", () => {
    test("transforms to StandardData format", () => {
      const json = JSON.stringify([
        {
          standardCode: "RL.2.1",
          gradeLevel: "2",
          subject: "ela",
          standardText: "Some text",
          strand: "RL",
          cognitiveDepth: "recall",
          performanceExpectations: "Expectations",
        },
      ]);

      const standards = parseLSSJSON(json);

      expect(standards[0]).toHaveProperty("standardCode");
      expect(standards[0]).toHaveProperty("gradeLevel");
      expect(standards[0]).toHaveProperty("subject");
      expect(standards[0]).toHaveProperty("standardText");
      expect(standards[0]).toHaveProperty("strand");
      expect(standards[0]).toHaveProperty("cognitiveDepth");
      expect(standards[0]).toHaveProperty("performanceExpectations");
    });

    test("preserves optional fields", () => {
      const json = JSON.stringify([
        {
          standardCode: "W.5.1a",
          gradeLevel: "5",
          subject: "ela",
          standardText: "Text",
          strand: "W",
          subStandard: "a",
          domain: "NBT", // Math field, but preserved
          cluster: "A",
        },
      ]);

      const standards = parseLSSJSON(json);

      expect(standards[0].subStandard).toBe("a");
      expect(standards[0].domain).toBe("NBT");
      expect(standards[0].cluster).toBe("A");
    });
  });
});

