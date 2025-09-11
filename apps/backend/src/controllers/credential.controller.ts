import { type Request, type Response } from "express";
import { z } from "zod";
import prisma from "../db/prisma";
import type { CustomRequest } from "../middleware/auth";

const createCredentialSchema = z.object({
  name: z.string().min(1, "Name is required"),
  application: z.string(),
  data: z.object({
    apikey: z.string().optional(),
    accessToken: z.string().optional(),
    businessAccountId: z.string().optional(),
  }),
});

const createCredential = async (req: CustomRequest, res: Response) => {
  try {
    const { data, error } = createCredentialSchema.safeParse(req.body);

    const user = req.user;
    // console.log(user);

    const user_id = user.id;

    if (error) {
      res.status(400).json({
        success: false,
        message: "Provide correct inputs!",
        error: error.message,
      });
      return;
    }

    console.log(data);
    const credential = await prisma.credential.create({
      data: {
        user_id,
        name: data.name,
        application: data.application,
        data: data.data,
      },
    });

    if (!credential) {
      res.json({
        success: false,
        message: "Credential adding failed!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Credentials added Successfully!",
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error while creating credential",
      error: error?.message,
    });
    return;
  }
};

const getAllCredentials = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    const user_id = user.id;

    const credentials = await prisma.credential.findMany({
      where: {
        user_id,
      },
      orderBy: [
        {
          updated_at: "desc",
        },
      ],
    });

    if (credentials.length === 0) {
      res.json({
        success: false,
        message: "No credentials yet!",
      });
      return;
    }

    res.status(200).json({
      success: true,
      // message : "Creds fetched Successfully!",
      credentials,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error while getting credentials",
      error: error?.message,
    });
    return;
  }
};

const updateCredentialSchema = z.object({
  name: z.string().min(1).optional(),
  data: z
    .object({
      apikey: z.string().optional(),
      accessToken: z.string().optional(),
      businessAccountId: z.string().optional(),
    })
    .partial()
    .optional(),
});

const updateCredential = async (req: CustomRequest, res: Response) => {
  try {
    const credentialId = req.params.id;
    const { data, error } = updateCredentialSchema.safeParse(req.body);

    if (error) {
      res.status(400).json({
        success: false,
        message: "Provide correct inputs!",
        error: error.message,
      });
      return;
    }

    const userId = req.user.id;

    // Ensure credential belongs to the user
    const existing = await prisma.credential.findFirst({
      where: { id: credentialId, user_id: userId },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "Credential not found" });
      return;
    }

    const updated = await prisma.credential.update({
      where: { id: credentialId },
      data: {
        name: data?.name ?? undefined,
        data: data?.data
          ? { ...(existing.data as any), ...data.data }
          : undefined,
        updated_at: new Date(),
      },
    });

    res.status(200).json({ success: true, credential: updated });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error while updating credential",
      error: error?.message,
    });
    return;
  }
};

const deleteCredential = async (req: CustomRequest, res: Response) => {
  try {
    const credentialId = req.params.id;
    const userId = req.user.id;

    const deleted = await prisma.credential.deleteMany({
      where: { id: credentialId, user_id: userId },
    });

    if (deleted.count === 0) {
      res.status(404).json({ success: false, message: "Credential not found" });
      return;
    }

    res
      .status(200)
      .json({ success: true, message: "Credential Deleted", id: credentialId });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Error while deleting credential",
      error: error?.message,
    });
    return;
  }
};

export {
  createCredential,
  getAllCredentials,
  updateCredential,
  deleteCredential,
};
