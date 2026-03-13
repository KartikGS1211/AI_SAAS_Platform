import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import pdf from "@cedrugs/pdf-parse";
import Groq from "groq-sdk";

const AI = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const improvedPrompt = `
        Write a detailed SEO-friendly article about "${prompt}".

        Requirements:
        - Length: around ${length} words
        - Include a catchy title
        - Write a short introduction
        - Add clear headings and subheadings
        - Use bullet points where needed
        - End with a strong conclusion
        - Use simple and professional language
          `;

    const response = await AI.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: improvedPrompt,
        },
      ],
      temperature: 0.6,
      max_tokens: length,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creation (user_id, prompt, content,type)
            VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateBlogTitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    // Improved prompt for better formatted titles
    const improvedPrompt = `
        Generate 10 SEO-friendly blog titles for the keyword "${prompt}".

        Rules:
        1. Return exactly 10 titles
        2. Number them from 1 to 10
        3. Titles must be catchy and professional
        4. Do not include explanations
            `;

    const response = await AI.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: improvedPrompt }],
      temperature: 0.6,
      max_tokens: 300,
    });

    const content = response.choices[0].message.content;

    await sql`INSERT INTO creation (user_id, prompt, content,type)
            VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

    if (plan !== "premium") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const generateImage = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required." });
    }

    const formData = new FormData();
    formData.append("prompt", prompt);

    const { data } = await axios.post(
      "https://clipdrop-api.co/text-to-image/v1",
      formData,
      {
        headers: { "x-api-key": process.env.CLIPDROP_API_KEY },
        responseType: "arraybuffer",
      },
    );

    const base64Image = `data:image/png;base64,${Buffer.from(data, "binary").toString("base64")}`;

    const uploadResult = await cloudinary.uploader.upload(base64Image);
    console.log("UploadResult:", uploadResult);
    const secure_url = uploadResult.secure_url;
    console.log("Secureurl:", secure_url);

    await sql`INSERT INTO creation (user_id, prompt, content,type, publish)
    VALUES (${userId}, ${prompt}, ${secure_url}, 'image' , ${publish ?? false})`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const { userId } = req.auth();
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(image.path, {
      transformation: [
        {
          effect: "background_removal",
          background_removal: "remove_the_background",
        },
      ],
    });
    const { secure_url } = uploadResult;

    await sql`INSERT INTO creation (user_id, prompt, content,type)
    VALUES (${userId}, 'Remove background from image', ${secure_url}, 'image')`;

    res.json({ success: true, content: secure_url });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const { userId } = req.auth;
    const { object } = req.body;
    const image = req.file;
    const plan = req.plan;

    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);

    const imageurl = cloudinary.url(public_id, {
      transformation: [{ effect: `gen_remove:${object}` }],
      resource_type: "image",
    });

    await sql`INSERT INTO creation (user_id, prompt, content,type)
    VALUES (${userId}, ${`Removed ${object} from image`}, ${imageurl}, 'image')`;

    res.json({ success: true, content: imageurl });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export const reviewResume = async (req, res) => {
  try {
    const { userId } = req.auth();
    const resume = req.file;
    const plan = req.plan;

    // 1. Check subscription
    if (plan !== "premium") {
      return res.json({
        success: false,
        message: "This feature is only available for premium subscriptions.",
      });
    }

    if (!resume) {
      return res.json({
        success: false,
        message: "Please upload a resume.",
      });
    }

    // 2. Check file size (5 MB)
    if (resume.size > 5 * 1024 * 1024) {
      return res.json({
        success: false,
        message: "Resume file size exceeds allowed size (5MB).",
      });
    }

    // 3. Read PDF file
    const dataBuffer = fs.readFileSync(resume.path);
    const pdfData = await pdf(dataBuffer);

    //  AI prompt
    const improvedPrompt = `
        You are a professional HR recruiter.

        Review the following resume and provide detailed feedback.

        Resume Content:
        ${pdfData.text}

        Provide feedback in this format:

        1. Overall Evaluation (short paragraph)

        2. Strengths
        - List the strong points in the resume (bullent points)

        3. Weaknesses
        - Mention missing or weak areas (bullent points)

        4. Suggestions for Improvement
        - Give actionable suggestions (short paragraph)

        5. ATS Optimization Tips
        - How to make this resume ATS friendly (bullent points)
        `;

    // 5. Call GROG API
    const response = await AI.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: improvedPrompt }],
      temperature: 0.6,
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;

    // 6. Save result in DB
    await sql`
      INSERT INTO creation (user_id, prompt, content, type)
      VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')
    `;

    // 7. Send response
    res.json({ success: true, content });
  } catch (error) {
    console.error(error.message);
    res.json({ success: false, message: error.message });
  }
};
