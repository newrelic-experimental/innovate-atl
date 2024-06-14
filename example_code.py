import requests
from google.transit import gtfs_realtime_pb2
import openai

# Set your API keys here
MARTA_GTFS_REALTIME_URL = 'your_marta_gtfs_realtime_url'
OPENAI_API_KEY = 'your_openai_api_key'

# Function to fetch and parse GTFS Realtime data
def fetch_gtfs_realtime_data(url):
    response = requests.get(url)
    response.raise_for_status()  # Raise an error for bad status codes
    feed = gtfs_realtime_pb2.FeedMessage()
    feed.ParseFromString(response.content)
    return feed

# Function to format GTFS Realtime data for ChatGPT
def format_gtfs_data(feed):
    formatted_data = []
    for entity in feed.entity:
        if entity.HasField('trip_update'):
            trip_update = entity.trip_update
            formatted_data.append(f"Trip ID: {trip_update.trip.trip_id}, Start Time: {trip_update.trip.start_time}, Route ID: {trip_update.trip.route_id}")
        elif entity.HasField('vehicle'):
            vehicle = entity.vehicle
            formatted_data.append(f"Vehicle ID: {vehicle.vehicle.id}, Position: ({vehicle.position.latitude}, {vehicle.position.longitude}), Current Stop: {vehicle.stop_id}")
    return "\n".join(formatted_data)

# Function to interact with ChatGPT API
def chatgpt_interaction(prompt):
    openai.api_key = OPENAI_API_KEY
    response = openai.Completion.create(
        engine="davinci-codex",  # Choose the appropriate engine
        prompt=prompt,
        max_tokens=150  # Adjust as necessary
    )
    return response.choices[0].text.strip()

# Example function to link MARTA's GTFS Realtime API to ChatGPT
def marta_to_chatgpt():
    # Fetch GTFS Realtime data from MARTA
    feed = fetch_gtfs_realtime_data(MARTA_GTFS_REALTIME_URL)
    
    # Format the data for ChatGPT
    formatted_data = format_gtfs_data(feed)
    
    # Create a prompt for ChatGPT with the fetched data
    prompt = f"MARTA GTFS Realtime data:\n{formatted_data}\n\nProvide an analysis or summary of the above data."
    
    # Get response from ChatGPT
    chatgpt_response = chatgpt_interaction(prompt)
    
    return chatgpt_response

# Example usage
if __name__ == '__main__':
    response = marta_to_chatgpt()
    print(response)
