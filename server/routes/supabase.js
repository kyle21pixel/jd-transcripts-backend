const express = require('express');
const router = express.Router();
const supabaseService = require('../services/supabaseService');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
    storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

// Test Supabase connection
router.get('/test', async (req, res) => {
    try {
        const result = await supabaseService.testConnection();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Authentication Routes
router.post('/auth/signup', async (req, res) => {
    try {
        const { email, password, ...userData } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await supabaseService.signUp(email, password, userData);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/auth/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await supabaseService.signIn(email, password);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(401).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/auth/signout', async (req, res) => {
    try {
        const result = await supabaseService.signOut();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.post('/auth/reset-password', async (req, res) => {
    try {
        const { email } = req.body;
        
        if (!email) {
            return res.status(400).json({
                success: false,
                error: 'Email is required'
            });
        }

        const result = await supabaseService.resetPassword(email);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Order Routes
router.post('/orders', async (req, res) => {
    try {
        const orderData = {
            ...req.body,
            created_at: new Date().toISOString(),
            status: 'pending'
        };

        const result = await supabaseService.createOrder(orderData);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/orders', async (req, res) => {
    try {
        const { user_id, status, limit, offset } = req.query;
        
        const filters = {};
        if (status) filters.status = status;
        
        const result = await supabaseService.getOrders(user_id, filters);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supabaseService.getOrders(null, { id });
        
        if (result.success && result.data.length > 0) {
            res.json({
                success: true,
                data: result.data[0]
            });
        } else {
            res.status(404).json({
                success: false,
                error: 'Order not found'
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.put('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = {
            ...req.body,
            updated_at: new Date().toISOString()
        };

        const result = await supabaseService.updateOrder(id, updateData);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/orders/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supabaseService.deleteOrder(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// File Upload Routes
router.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                error: 'No file provided'
            });
        }

        const { bucket = 'uploads', folder = '' } = req.body;
        const fileName = `${Date.now()}-${req.file.originalname}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        const result = await supabaseService.uploadFile(
            bucket,
            filePath,
            req.file.buffer,
            {
                contentType: req.file.mimetype
            }
        );

        if (result.success) {
            // Get public URL
            const urlResult = await supabaseService.getPublicUrl(bucket, filePath);
            
            res.status(201).json({
                success: true,
                data: {
                    ...result.data,
                    publicUrl: urlResult.url,
                    fileName,
                    filePath,
                    bucket
                }
            });
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/download/:bucket/:path(*)', async (req, res) => {
    try {
        const { bucket, path: filePath } = req.params;
        
        const result = await supabaseService.downloadFile(bucket, filePath);
        
        if (result.success) {
            res.setHeader('Content-Type', 'application/octet-stream');
            res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filePath)}"`);
            res.send(result.data);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/files/:bucket/:path(*)', async (req, res) => {
    try {
        const { bucket, path: filePath } = req.params;
        
        const result = await supabaseService.deleteFile(bucket, filePath);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/signed-url/:bucket/:path(*)', async (req, res) => {
    try {
        const { bucket, path: filePath } = req.params;
        const { expiresIn = 3600 } = req.query;
        
        const result = await supabaseService.createSignedUrl(bucket, filePath, parseInt(expiresIn));
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Admin Routes (require admin privileges)
router.post('/admin/users', async (req, res) => {
    try {
        const { email, password, ...userData } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        const result = await supabaseService.adminCreateUser(email, password, userData);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/admin/users', async (req, res) => {
    try {
        const { page = 1, perPage = 50 } = req.query;
        
        const result = await supabaseService.adminListUsers(
            parseInt(page),
            parseInt(perPage)
        );
        
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/admin/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await supabaseService.adminDeleteUser(id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;