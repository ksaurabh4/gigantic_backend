const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userAlertValidation = require('../../validations/userAlert.validation');
const userAlertController = require('../../controllers/userAlert.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('manageUserAlerts'), validate(userAlertValidation.createUserAlert), userAlertController.createUserAlert)
  .get(auth('getUserAlerts'), validate(userAlertValidation.getUserAlerts), userAlertController.getUserAlerts);

router.route('/list').get(auth('getUserAlerts'), validate(userAlertValidation.getUserAlert), userAlertController.getUserAlertsList);

router.route('/device/:deviceImei').get(auth('getUserAlerts'), validate(userAlertValidation.getUsersWithAlerts), userAlertController.getUsersWithAlerts);

router
  .route('/:userAlertId')
  .get(auth('getUserAlerts'), validate(userAlertValidation.getUserAlert), userAlertController.getUserAlert)
  .patch(auth('manageUserAlerts'), validate(userAlertValidation.updateUserAlert), userAlertController.updateUserAlert)
  .delete(auth('manageUserAlerts'), validate(userAlertValidation.deleteUserAlert), userAlertController.deleteUserAlert);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: UserAlerts
 *   description: UserAlert management and retrieval
 */

/**
 * @swagger
 * /userAlerts:
 *   post:
 *     summary: Create a userAlert
 *     description: Only admins can create other userAlerts.
 *     tags: [UserAlerts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *               role:
 *                  type: string
 *                  enum: [userAlert, admin]
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *               role: userAlert
 *     responses:
 *       "201":
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserAlert'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *
 *   get:
 *     summary: Get all userAlerts
 *     description: Only admins can retrieve all userAlerts.
 *     tags: [UserAlerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: UserAlert name
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: UserAlert role
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. name:asc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of userAlerts
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/UserAlert'
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 totalResults:
 *                   type: integer
 *                   example: 1
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 */

/**
 * @swagger
 * /userAlerts/{id}:
 *   get:
 *     summary: Get a userAlert
 *     description: Logged in userAlerts can fetch only their own userAlert information. Only admins can fetch other userAlerts.
 *     tags: [UserAlerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserAlert id
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserAlert'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   patch:
 *     summary: Update a userAlert
 *     description: Logged in userAlerts can only update their own information. Only admins can update other userAlerts.
 *     tags: [UserAlerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserAlert id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/UserAlert'
 *       "400":
 *         $ref: '#/components/responses/DuplicateEmail'
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 *
 *   delete:
 *     summary: Delete a userAlert
 *     description: Logged in userAlerts can delete only themselves. Only admins can delete other userAlerts.
 *     tags: [UserAlerts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: UserAlert id
 *     responses:
 *       "200":
 *         description: No content
 *       "401":
 *         $ref: '#/components/responses/Unauthorized'
 *       "403":
 *         $ref: '#/components/responses/Forbidden'
 *       "404":
 *         $ref: '#/components/responses/NotFound'
 */
