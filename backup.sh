#!/bin/bash
DATA=$(date +%Y%m%d_%H%M%S)
PASTA="backup_obaleva_$DATA"

echo "📦 Criando backup em: $PASTA"

mkdir -p $PASTA
mkdir -p $PASTA/src/components
mkdir -p $PASTA/src/pages
mkdir -p $PASTA/src/contexts
mkdir -p $PASTA/src/lib

cp src/components/*.tsx $PASTA/src/components/ 2>/dev/null
cp src/pages/*.tsx $PASTA/src/pages/ 2>/dev/null
cp src/contexts/*.tsx $PASTA/src/contexts/ 2>/dev/null
cp src/lib/*.ts $PASTA/src/lib/ 2>/dev/null
cp src/*.tsx $PASTA/src/ 2>/dev/null
cp src/*.css $PASTA/src/ 2>/dev/null
cp .env $PASTA/ 2>/dev/null
cp package.json $PASTA/
cp vite.config.ts $PASTA/ 2>/dev/null
cp tailwind.config.js $PASTA/ 2>/dev/null

echo "✅ Backup concluído em: $PASTA"
ls -la $PASTA/