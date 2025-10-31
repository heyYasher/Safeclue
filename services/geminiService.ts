import { GoogleGenAI } from "@google/genai";
import type { Project, TimelineStage } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development and will be handled by the execution environment.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateProgressSummary = async (projectName: string, timeline: TimelineStage[]): Promise<string> => {
  if (!API_KEY) {
    return "API Key is not configured. Please set the API_KEY environment variable.";
  }

  const timelineDetails = timeline
    .map(stage => `- ${stage.name}: ${stage.status} (${stage.progress}%)`)
    .join('\n');

  const prompt = `
    You are a construction project manager. Based on the following timeline data for the project "${projectName}", write a brief, easy-to-understand progress summary for a client.
    Keep it concise and positive, highlighting completed work and current progress.

    Timeline Data:
    ${timelineDetails}

    Summary:
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Could not generate summary due to an error. Please check the console for details.";
  }
};

export const generateDetailedReport = async (project: Project): Promise<string> => {
  if (!API_KEY) {
    return "API Key is not configured. Please set the API_KEY environment variable.";
  }

  const timelineDetails = project.timeline
    .map(stage => `- ${stage.name}: ${stage.status} (${stage.progress}%)`)
    .join('\n');
    
  const updatesDetails = project.updates.length > 0 
    ? project.updates
        .map(update => `- On ${update.date}, ${update.author} noted: "${update.caption}"`)
        .join('\n')
    : 'No recent updates posted.';

  const prompt = `
    You are a construction project analyst providing a detailed progress report for a client. The project is "${project.name}".
    Analyze the provided timeline data and recent updates to generate a comprehensive report.

    **Project Data:**
    *Project Name:* ${project.name}
    *Description:* ${project.description}

    **Timeline Status:**
    ${timelineDetails}

    **Recent Updates:**
    ${updatesDetails}

    **Instructions:**
    Based on the data, generate a report with the following structure. Use markdown for formatting.
    Ensure list items start with a \`* \` and are on new lines.
    
    ### 1. Overall Summary
    Provide a brief, high-level overview of the project's current standing.

    ### 2. Key Achievements
    List the most significant milestones that have been completed or are nearing completion.

    ### 3. Areas of Focus & Potential Risks
    Identify any stages that are pending or have low progress. Based on the notes and progress, gently highlight any potential delays or areas that require attention without being alarming. If there are no obvious risks, state that the project is proceeding as planned.

    ### 4. Next Steps
    Briefly mention what the next immediate stages of the project are.
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating detailed report:", error);
    return "Could not generate a detailed report due to an error. Please check the console for details.";
  }
};
