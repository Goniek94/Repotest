// dashboardController.js
import User from '../models/user.js';
import Ad from '../models/ad.js';
import Comment from '../models/comment.js';

// Statystyki dla dashboard
const getDashboardStats = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const listingsCount = await Ad.countDocuments();
    const commentsCount = await Comment.countDocuments();

    // Ostatnie aktywności - możesz dostosować wg. potrzeb
    const recentActivities = [
      {
        type: 'user',
        description: 'Nowy użytkownik zarejestrowany',
        time: '2 minuty temu'
      },
      {
        type: 'listing',
        description: 'Nowe ogłoszenie dodane',
        time: '5 minut temu'
      },
      {
        type: 'comment',
        description: 'Zgłoszono komentarz',
        time: '10 minut temu'
      }
    ];

    // Zwracamy odpowiedź
    res.status(200).json({
      usersCount,
      listingsCount,
      commentsCount,
      reportsCount: 5, // Przykładowa wartość
      recentActivities
    });
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk:', error);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania statystyk' });
  }
};

// Statystyki miesięczne
const getMonthlyStats = async (req, res) => {
  try {
    // Pobieramy statystyki miesięczne dla ogłoszeń
    const monthlyListings = await Ad.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Pobieramy statystyki miesięczne dla użytkowników
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Łączymy dane w jeden format dla wykresu
    const chartData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const listingData = monthlyListings.find(item => item._id === month);
      const userData = monthlyUsers.find(item => item._id === month);

      return {
        name: month.toString(), // Miesiąc jako string
        listings: listingData ? listingData.count : 0,
        users: userData ? userData.count : 0
      };
    });

    res.status(200).json(chartData);
  } catch (error) {
    console.error('Błąd podczas pobierania statystyk miesięcznych:', error);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania statystyk miesięcznych' });
  }
};

export { getDashboardStats, getMonthlyStats };