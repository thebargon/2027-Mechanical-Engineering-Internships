import { describe, expect, test } from "bun:test";
import { getCategory, isInternship, matchesKeywords, matchesTitle, isEngineeringTitle, isMechanicalInternship } from "./filters";

describe("internship eligibility", () => {
  test("rejects international and internal roles", () => {
    expect(isInternship("Government Program Development Manager (International)")).toBe(false);
    expect(isInternship("Internal Mechanical Engineer")).toBe(false);
  });
  test("accepts internship and co-op title variants", () => {
    for (const title of ["Mechanical Intern", "Engineering Internship", "Manufacturing Co-op", "Thermal Co Op", "Mechanical Coop", "Student Engineer"]) {
      expect(isInternship(title)).toBe(true);
    }
  });
  test("excludes software roles even when descriptions match engineering keywords", () => {
    expect(matchesKeywords("Develop vehicle software and automation")).toBe(true);
    expect(isInternship("Flight Software Engineering Intern - Fall 2026")).toBe(false);
    expect(matchesTitle("Software Intern - Mechanical Systems")).toBe(false);
  });
});

describe("engineering keywords", () => {
  test("company boilerplate does not establish that a non-engineering title is relevant", () => {
    expect(isEngineeringTitle("Supply Chain Intern 2027")).toBe(false);
    expect(isEngineeringTitle("Environmental, Health, and Safety (EHS) Intern - 2027")).toBe(false);
    expect(isEngineeringTitle("Engineering Intern 2027")).toBe(false);
  });
  test("short keywords must match whole words", () => {
    expect(matchesKeywords("Development intern")).toBe(false);
    expect(matchesKeywords("Across teams")).toBe(false);
    expect(matchesKeywords("Next generation")).toBe(false);
    expect(getCategory("Development intern")).toBe("other");
  });
  test("preserves acronyms and punctuation", () => {
    for (const text of ["NX Intern", "GD&T Intern", "CAD Intern", "Mechanical Engineering Intern"]) {
      expect(matchesTitle(text)).toBe(true);
    }
    expect(getCategory("Propulsion Test Engineering Intern")).toBe("aerospace");
  });
});

describe("strict mechanical internship scope", () => {
  test("keeps clear mechanical disciplines and hands-on adjacent engineering", () => {
    for (const title of ["Mechanical Engineer Intern 2027", "Manufacturing Engineering Co-op", "Thermal Systems Intern", "Fluid Dynamics Intern", "HVAC Engineering Intern", "Propulsion Test Intern", "Structures/Mechanical Engineering Intern", "Mechatronics Intern", "Electromechanical Design Intern", "Robotics Engineer Intern", "Powertrain Intern", "Chassis Engineering Intern", "Industrial Engineering Intern", "Tooling Intern"]) {
      expect(isMechanicalInternship(title), title).toBe(true);
    }
  });
  test("rejects unrelated roles even when the title includes a mechanical keyword", () => {
    for (const title of ["Electrical Engineer Intern 2027", "Mechanical Systems Software Intern", "Robotics Firmware Intern", "Embedded Controls Intern", "Manufacturing Data Science Intern", "CAD Sales Intern", "Civil Structures Intern", "Mechanical Engineering Intern Program Manager", "Mechanical Engineering Student Advisor", "Mechanical Engineer", "Senior Mechanical Intern", "Data Structures Intern"]) {
      expect(isMechanicalInternship(title), title).toBe(false);
    }
  });
  test("ambiguous titles and industry names alone do not establish mechanical relevance", () => {
    for (const title of ["Engineering Intern", "Mission Systems Engineering Intern", "UIUC Research Park Intern - Validation", "Test and Operations Engineering Intern", "Subsystem Test Engineering Intern", "Hardware Intern", "Semiconductor Intern", "Energy Intern", "Regulatory Intern", "Medical Device Intern", "EV Intern", "ROS Intern", "Controls Intern"]) {
      expect(isMechanicalInternship(title), title).toBe(false);
    }
  });
});
