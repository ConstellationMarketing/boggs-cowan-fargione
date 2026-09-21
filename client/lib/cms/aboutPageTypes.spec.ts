import { describe, it, expect } from "vitest";
import { groupTeamMembers, resolveTeamCategory, type TeamMember } from "./aboutPageTypes";

function member(name: string, title: string, category?: TeamMember["category"]): TeamMember {
  return { name, title, bio: "", image: "", imageAlt: "", credentials: [], category };
}

const labels = {
  sectionLabel: "MEET OUR ATTORNEYS",
  paralegalsLabel: "MEET OUR PARALEGALS",
  staffLabel: "MEET OUR OFFICE STAFF",
};

describe("resolveTeamCategory", () => {
  it("uses the saved category over the title", () => {
    expect(resolveTeamCategory(member("A", "Paralegal", "staff"))).toBe("staff");
    expect(resolveTeamCategory(member("B", "Attorney | Partner", "paralegal"))).toBe("paralegal");
  });

  it("infers paralegal from the title when no category is saved", () => {
    expect(resolveTeamCategory(member("C", "Paralegal"))).toBe("paralegal");
    expect(resolveTeamCategory(member("D", "Senior paralegal"))).toBe("paralegal");
  });

  it("defaults to attorney when no category is saved", () => {
    expect(resolveTeamCategory(member("E", "Attorney | Founder"))).toBe("attorney");
    expect(resolveTeamCategory(member("F", ""))).toBe("attorney");
  });

  it("ignores an unknown saved category", () => {
    const legacy = { ...member("G", "Paralegal"), category: "intern" as TeamMember["category"] };
    expect(resolveTeamCategory(legacy)).toBe("paralegal");
  });
});

describe("groupTeamMembers", () => {
  it("orders groups attorney, paralegal, staff and keeps list order inside a group", () => {
    const members = [
      member("Staff One", "Receptionist", "staff"),
      member("Para One", "Paralegal"),
      member("Atty One", "Attorney | Founder"),
      member("Para Two", "Paralegal"),
      member("Atty Two", "Attorney | Partner"),
    ];

    const groups = groupTeamMembers(labels, members);

    expect(groups.map((group) => group.category)).toEqual(["attorney", "paralegal", "staff"]);
    expect(groups.map((group) => group.label)).toEqual([
      "MEET OUR ATTORNEYS",
      "MEET OUR PARALEGALS",
      "MEET OUR OFFICE STAFF",
    ]);
    expect(groups[0].members.map((m) => m.name)).toEqual(["Atty One", "Atty Two"]);
    expect(groups[1].members.map((m) => m.name)).toEqual(["Para One", "Para Two"]);
  });

  it("drops groups with no members", () => {
    const groups = groupTeamMembers(labels, [
      member("Atty One", "Attorney | Founder"),
      member("Para One", "Paralegal"),
    ]);

    expect(groups.map((group) => group.category)).toEqual(["attorney", "paralegal"]);
  });

  it("returns no groups when there are no members", () => {
    expect(groupTeamMembers(labels, [])).toEqual([]);
  });
});
