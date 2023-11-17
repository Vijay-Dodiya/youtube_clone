import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "..";
import { RecommendedVideos } from "../../Types";
import { parseRecommendedData } from "../../utils";
import { YOUTUBE_API_URL } from "../../utils/constants";

const API_KEY = import.meta.env.VITE_REACT_APP_YOUTUBE_DATA_API_KEY;

export const getRecommendedVideos = createAsyncThunk(
    "youtubeApp/getRecommendedVideos",
    async (videoId: string, { getState }) => {
      const {
        youtubeApp: { currentPlaying },
      } = getState() as RootState;
      if (currentPlaying && currentPlaying.channelInfo) {
        const channelId = currentPlaying.channelInfo.id;
  
        const {
          data: { items },
        } = await axios.get(
          `${YOUTUBE_API_URL}/activities?key=${API_KEY}&channelId=${channelId}&part=snippet,contentDetails&maxResults=20&type=video&videoId=${videoId}`
        );
  
        const parsedData: RecommendedVideos[] = await parseRecommendedData(
          items,
          videoId
        );
  
        return { parsedData };
      } else {
        // Handle the case where currentPlaying is null
        return { parsedData: [] };
      }
  }
);