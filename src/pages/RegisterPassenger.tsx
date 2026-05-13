<motion.button
            onClick={() => navigate('/login')}
            className="back-button-outline"
            type="button"
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
            whileTap={{ scale: 0.92 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <ArrowLeft size={22} />
          </motion.button>