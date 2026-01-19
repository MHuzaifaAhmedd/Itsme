import { Router, Request, Response } from 'express';
import Contact from '../models/Contact';

const router = Router();

// POST /api/contact - Submit contact form
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, message } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: name, email, message',
      });
    }

    // Create contact entry
    const contact = new Contact({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

    await contact.save();

    // TODO: Add email sending logic here (e.g., using nodemailer, SendGrid, etc.)
    console.log('New contact form submission:', {
      id: contact._id,
      name: contact.name,
      email: contact.email,
    });

    res.status(201).json({
      success: true,
      message: 'Thank you for your message! I will get back to you soon.',
      contactId: contact._id,
    });
  } catch (error: any) {
    console.error('Error processing contact form:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: Object.values(error.errors).map((e: any) => e.message).join(', '),
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to process contact form',
    });
  }
});

// GET /api/contact - Get all contact messages (for admin use)
router.get('/', async (_req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: contacts.length,
      contacts,
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contacts',
    });
  }
});

// GET /api/contact/:id - Get single contact message
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch contact',
    });
  }
});

// PUT /api/contact/:id/read - Mark contact as read
router.put('/:id/read', async (req: Request, res: Response) => {
  try {
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'Contact message not found',
      });
    }

    res.json({
      success: true,
      contact,
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update contact',
    });
  }
});

export default router;
