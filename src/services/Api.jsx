const INSTAGRAM_API_BASE_URL = 'https://graph.instagram.com';

class InstagramAPI {
  constructor(accessToken) {
    this.accessToken = accessToken;
  }

  // Obtener información del usuario
  async getUserInfo() {
    try {
      const response = await fetch(
        `${INSTAGRAM_API_BASE_URL}/me?fields=id,username,account_type,media_count,followers_count,profile_picture_url&access_token=IGAAS9hVrFVlhBZAFlUenRXMlgzdDRtajF1R3F4U3ZA6dGpjMG5fT045bzhtUWZAucjBKZA29pSS1Lb3F6SjRCZAFMyOFRYUVZA5VG5EREtJN3NkSVptbzJFd250MDBrMmIzWG03VUVEOGVVZAm5fRzlfM3VHWFlKTHhHX0dGaTAwNU44cwZDZD`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  // Obtener medias del usuario
  async getUserMedia(limit = 25) {
    try {
      const response = await fetch(
        `${INSTAGRAM_API_BASE_URL}/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=${limit}&access_token=IGAAS9hVrFVlhBZAFlUenRXMlgzdDRtajF1R3F4U3ZA6dGpjMG5fT045bzhtUWZAucjBKZA29pSS1Lb3F6SjRCZAFMyOFRYUVZA5VG5EREtJN3NkSVptbzJFd250MDBrMmIzWG03VUVEOGVVZAm5fRzlfM3VHWFlKTHhHX0dGaTAwNU44cwZDZD`
      );
      const mediaData = await response.json();

      const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
      const requiredHashtag = '#muestra2026';
      const recentVideos = (mediaData.data || [])
        .filter((media) => {
          const publishedAt = new Date(media.timestamp).getTime();
          const caption = (media.caption || '').toLowerCase();
          return (
            media.media_type === 'VIDEO' &&
            publishedAt >= oneWeekAgo &&
            caption.includes(requiredHashtag)
          );
        })
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      return {
        ...mediaData,
        data: recentVideos,
      };
    } catch (error) {
      console.error('Error fetching media:', error);
      throw error;
    }
  }

  // Obtener insights de un media específico
  async getMediaInsights(mediaId) {
    try {
      const response = await fetch(
        `${INSTAGRAM_API_BASE_URL}/${mediaId}/insights?metric=engagement,impressions,reach,saved&access_token=IGAAS9hVrFVlhBZAFlUenRXMlgzdDRtajF1R3F4U3ZA6dGpjMG5fT045bzhtUWZAucjBKZA29pSS1Lb3F6SjRCZAFMyOFRYUVZA5VG5EREtJN3NkSVptbzJFd250MDBrMmIzWG03VUVEOGVVZAm5fRzlfM3VHWFlKTHhHX0dGaTAwNU44cwZDZD`
      );
      return await response.json();
    } catch (error) {
      console.error('Error fetching media insights:', error);
      throw error;
    }
  }

  // Calcular engagement total
  async getTotalEngagement() {
    try {
      const mediaData = await this.getUserMedia();
      
      if (!mediaData.data) {
        return null;
      }

      const totalEngagement = mediaData.data.reduce((acc, media) => {
        return {
          totalLikes: acc.totalLikes + (media.like_count || 0),
          totalComments: acc.totalComments + (media.comments_count || 0),
          mediaCount: acc.mediaCount + 1,
        };
      }, {
        totalLikes: 0,
        totalComments: 0,
        mediaCount: 0,
      });

      return {
        ...totalEngagement,
        avgEngagementPerPost: totalEngagement.mediaCount > 0
          ? ((totalEngagement.totalLikes + totalEngagement.totalComments) / totalEngagement.mediaCount).toFixed(2)
          : 0
      };
    } catch (error) {
      console.error('Error calculating total engagement:', error);
      throw error;
    }
  }
}

export default InstagramAPI;
