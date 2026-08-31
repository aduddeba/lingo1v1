'use client';

import { motion } from 'framer-motion';
import type { ChainStage } from '@/types/practice';

function ChainArrow() {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="h-4 w-px bg-gray-300" />
      <svg width="10" height="6" viewBox="0 0 10 6" className="text-gray-400" fill="currentColor">
        <path d="M5 6L0 0h10L5 6z" />
      </svg>
    </div>
  );
}

export function WordFormChain({ chain, hiddenIndex }: { chain: ChainStage[]; hiddenIndex: number }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-0">
      {chain.map((stage, i) => (
        <div key={`${stage.language}:${i}`} className="flex w-full flex-col items-center">
          {i > 0 && <ChainArrow />}
          {i === hiddenIndex ? (
            <HiddenWordStage language={stage.language} />
          ) : (
            <VisibleWordStage stage={stage} />
          )}
        </div>
      ))}
    </div>
  );
}

function VisibleWordStage({ stage }: { stage: ChainStage }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
        {stage.language}
      </p>
      <p className="font-bold text-gray-900">{stage.form}</p>
      {stage.gloss && (
        <p className="mt-0.5 text-xs italic text-gray-400">{stage.gloss}</p>
      )}
    </div>
  );
}

function HiddenWordStage({ language }: { language: string }) {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 0 0px #0284c720', '0 0 0 4px #0284c720', '0 0 0 0px #0284c720'] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-3"
    >
      <p className="mb-0.5 text-xs font-semibold uppercase tracking-widest text-brand-600">
        {language}
      </p>
      <motion.p
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="font-bold tracking-widest text-brand-500"
      >
        ???
      </motion.p>
      <p className="mt-0.5 text-xs text-brand-400">&larr; predict this stage</p>
    </motion.div>
  );
}

export function LanguageAncestryChain({ chain, hiddenIndex }: { chain: string[]; hiddenIndex: number }) {
  return (
    <div className="mb-6 flex flex-col items-center gap-0">
      {chain.map((lang, i) => (
        <div key={`${lang}:${i}`} className="flex w-full flex-col items-center">
          {i > 0 && <ChainArrow />}
          {i === hiddenIndex ? (
            <HiddenLanguageStage />
          ) : (
            <VisibleLanguageStage language={lang} />
          )}
        </div>
      ))}
    </div>
  );
}

function VisibleLanguageStage({ language }: { language: string }) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-center">
      <p className="font-bold text-gray-900">{language}</p>
    </div>
  );
}

function HiddenLanguageStage() {
  return (
    <motion.div
      animate={{ boxShadow: ['0 0 0 0px #0284c720', '0 0 0 4px #0284c720', '0 0 0 0px #0284c720'] }}
      transition={{ duration: 2, repeat: Infinity }}
      className="w-full rounded-xl border-2 border-brand-400 bg-brand-50 px-4 py-3 text-center"
    >
      <motion.p
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1.4, repeat: Infinity }}
        className="text-lg font-extrabold tracking-widest text-brand-500"
      >
        ???
      </motion.p>
      <p className="mt-0.5 text-xs text-brand-400">&larr; predict this language</p>
    </motion.div>
  );
}
