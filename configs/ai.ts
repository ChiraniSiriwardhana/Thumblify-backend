import { HfInference } from "@huggingface/inference";

const ai = new HfInference(process.env.HF_API_KEY as string);

export default ai;