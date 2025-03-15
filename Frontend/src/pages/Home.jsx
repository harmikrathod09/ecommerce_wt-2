import MainBanner from './home/MainBanner'
import CategorySection from './home/CategorySection'
import BestProductSection from './home/BestProductSection'
import SubBanners from './home/SubBanners'
import FeaturedProductSection from './home/FeaturedProductSection'
import DiscountBanner from './home/DiscountBanner'
import PopularProductsSection from './home/PopularProductsSection'
import ArrivedProductSection from './home/ArrivedProductSection'
import AppAdBanner from './home/AppAdBanner'
import SuggestionSection from './home/SuggestionSection'
import FunctionalityCardSection from './home/FunctionalityCardSection'

export default function Home() {
  return (
    <>
        <MainBanner />

        <CategorySection />

        <BestProductSection />

        <SubBanners />

        <FeaturedProductSection />

        <DiscountBanner />

        <PopularProductsSection />

        <ArrivedProductSection />

        <AppAdBanner />

        <SuggestionSection />

        <FunctionalityCardSection />
    </>
  );
}
