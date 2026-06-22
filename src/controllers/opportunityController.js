import Opportunity from "../models/Opportunity.js";

const OWNER_FIELDS = ["owner", "user_id", "created_by", "createdBy", "userId"];

function stripOwnerFields(body) {
  const data = { ...body };
  for (const field of OWNER_FIELDS) {
    delete data[field];
  }
  return data;
}

function parseOpportunityInput(body) {
  const data = stripOwnerFields(body);

  if (data.estimatedValue === "" || data.estimatedValue === undefined) {
    data.estimatedValue = null;
  } else if (data.estimatedValue !== null) {
    data.estimatedValue = Number(data.estimatedValue);
    if (Number.isNaN(data.estimatedValue) || data.estimatedValue < 0) {
      throw new Error("Estimated value must be a non-negative number");
    }
  }

  if (data.nextFollowUpDate === "" || data.nextFollowUpDate === undefined) {
    data.nextFollowUpDate = null;
  } else if (data.nextFollowUpDate) {
    data.nextFollowUpDate = new Date(data.nextFollowUpDate);
  }

  return data;
}

export async function getOpportunities(req, res) {
  try {
    const opportunities = await Opportunity.find()
      .populate("owner", "name email")
      .sort({ createdAt: -1 });

    return res.json(opportunities);
  } catch (error) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function createOpportunity(req, res) {
  try {
    const data = parseOpportunityInput(req.body);

    if (!data.customerName?.trim() || !data.requirement?.trim()) {
      return res.status(400).json({ message: "Customer name and requirement are required" });
    }

    const opportunity = await Opportunity.create({
      ...data,
      owner: req.user._id,
    });

    await opportunity.populate("owner", "name email");

    return res.status(201).json(opportunity);
  } catch (error) {
    if (error.message.includes("Estimated value")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function getOpportunityById(req, res) {
  try {
    const opportunity = await Opportunity.findById(req.params.id).populate("owner", "name email");

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    return res.json(opportunity);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function updateOpportunity(req, res) {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (String(opportunity.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to update this opportunity" });
    }

    const data = parseOpportunityInput(req.body);

    if (data.customerName !== undefined && !data.customerName?.trim()) {
      return res.status(400).json({ message: "Customer name is required" });
    }
    if (data.requirement !== undefined && !data.requirement?.trim()) {
      return res.status(400).json({ message: "Requirement is required" });
    }

    Object.assign(opportunity, data);
    await opportunity.save();
    await opportunity.populate("owner", "name email");

    return res.json(opportunity);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    if (error.message.includes("Estimated value")) {
      return res.status(400).json({ message: error.message });
    }
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: Object.values(error.errors).map((e) => e.message).join(", ") });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export async function deleteOpportunity(req, res) {
  try {
    const opportunity = await Opportunity.findById(req.params.id);

    if (!opportunity) {
      return res.status(404).json({ message: "Opportunity not found" });
    }

    if (String(opportunity.owner) !== String(req.user._id)) {
      return res.status(403).json({ message: "Not authorized to delete this opportunity" });
    }

    await opportunity.deleteOne();

    return res.json({ message: "Opportunity deleted" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(404).json({ message: "Opportunity not found" });
    }
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
