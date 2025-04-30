import { motion } from 'motion/react';
import { AuroraBackground } from '../components/ui/aurora-background';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: 'easeInOut',
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4">
        <img src="/FinSight.png" alt="FinSight" className="h-48 w-auto mb-4" />
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Take control of your money.
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-6 max-w-3xl">
          <p className="text-center mx-10 px-4">
            Make every financial decision with AI-powered clarity. FinSight
            analyzes your entire portfolio, highlighting strengths, flagging
            risks, and suggesting smart moves based on your unique financial
            position.
          </p>
        </div>
        <Button size="lg" asChild>
          <Link to="/signup">Get Started</Link>
        </Button>
      </motion.div>
    </AuroraBackground>
  );
}
