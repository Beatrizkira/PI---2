
import HeaderOne from "@/components/header/HeaderOne";
import AboutBanner from "@/components/banner/AboutBanner";
import CounterOne from "@/components/counterup/CounterOne";
import About from "@/components/about/About";
import Team from "@/components/about/Team";
import ServiceOne from "@/components/service/ServiceOne";
import TestimonilsOne from "@/components/testimonials/TestimonilsOne";
import ShortService from "@/components/service/ShortService";

import Footer from "@/components/footer/Footer";

export default function Home() {
    return (
        <div className="demo-one">
            <HeaderOne />
            <AboutBanner />
            <CounterOne/>
            <About/>
            <Team/>
            <ServiceOne/>
            <TestimonilsOne/>
            <ShortService/>



            <Footer />

        </div>
    );
}
