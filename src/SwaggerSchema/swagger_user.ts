// GetAll

/**
 * @openapi
 * /users:
 *  get:
 *     tags:
 *     - User
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 */

// Get One user
/**
 * @openapi
 * /users/{id}/:
 *  get:
 *     summary: Get one user Id
 *     tags:
 *     - User
 *     parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: user Id
 *     description: Responds if the app is up and running
 *     responses:
 *       200:
 *         description: App is up and running
 *         contents:
 *         application/json:
 */

// Post One user

/**
 * @openapi
 * '/users':
 *  post:
 *     tags:
 *     - User
 *     summary: Register a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */

/**
 * @openapi
 * components:
 *  schemas:
 *    CreateUserInput:
 *      type: object
 *      required:
 *        - username
 *        - email
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        username:
 *          type: string
 *          default: Jane Doe
 *    CreateUserResponse:
 *      type: object
 *      properties:
 *        email:
 *          type: string
 *        username:
 *          type: string
 *        _id:
 *          type: string
 *        createdAt:
 *          type: string
 *        updatedAt:
 *          type: string
 */

// Put One user

/**
 * @openapi
 * '/users/:id':
 *  putOne:
 *     tags:
 *     - User
 *     summary: Update a user
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/CreateUserResponse'
 *      409:
 *        description: Conflict
 *      400:
 *        description: Bad request
 */
